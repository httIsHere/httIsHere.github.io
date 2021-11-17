---
title: 「ROAD 6」浏览器原理
urlname: yoo7gw
date: '2021-09-27 14:16:56 +0800'
tags:
  - ROAD 6
categories:
  - 大前端
---

### HTTP 协议

URL -> (HTTP) ->[HTML ->( parse) -> DOM](https://www.yuque.com/httishere/running/hr55oy) -> [(CSS computing) ](https://www.yuque.com/httishere/running/ur0kri)-> DOM with CSS -> layout ->DOM with position ->(render) -> Bitmap

![](https://gitee.com/httishere/blog-image/raw/master/img/%E6%B5%8F%E8%A7%88%E5%99%A8.png#id=iVkUm&originHeight=322&originWidth=2930&originalType=binary∶=1&status=done&style=none)

![](https://gitee.com/httishere/blog-image/raw/master/img/Xnip2021-09-01_15-46-45.jpg#id=CXWLp&originHeight=636&originWidth=936&originalType=binary∶=1&status=done&style=none)

#### TCP 与 IP 的基础知识

- 流
- 端口
- require('net')
- 包
- IP 地址
- libnet/libpcap

### Toy-Browser

[RFC2616](https://datatracker.ietf.org/doc/html/rfc2616/)

#### request

- Request line (POST / HTTP/1.1)
  ![](https://gitee.com/httishere/blog-image/raw/master/img/image-20210913170214302.png#id=ymGQa&originHeight=246&originWidth=500&originalType=binary∶=1&status=done&style=none)
- headers
  - Host: 127.0.0.1
  - Content-Type: application/x-www-form-urlencoded
  - (空行)
- body (filed=xxx&code=xxx)

#### response

- Status line (HTTP/1.1 200 OK)
- headers
  - Content-Type: text/html
  - Date: Mon, 13 Sep 2021 10:13:57 GMT
  - Connection: keep-alive
  - Transfer-Encoding: chunked
  - (空行)
- body
  - 26 (body 字符数)
  - `<html><body>Hello World</body></html>`
  - 0
  - (空行)

#### 简易 server 和 client

```javascript
// server.js
const http = require("http");

const server = http.createServer((req, res) => {
  console.log("request received");
  res.setHeader("Content-Type", "text/html");
  res.setHeader("x-Foo", "bar");
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("ok");
});

server.listen(8088);
```

```javascript
// client.js
const net = require("net");

const client = net.createConnection(
  {
    host: "127.0.0.1",
    port: 8088,
  },
  () => {
    // 'connect' listener.
    console.log("connected to server!");
    client.write("POST / HTTP/1.1\r\n");
    client.write("Host: 127.0.0.1\r\n");
    client.write("Content-Length: 19\r\n");

    client.write("Content-Type: application/x-www-form-urlencoded\r\n");
    client.write("\r\n");
    client.write("filed=xxxx&code=xxx\r\n");
    client.write("\r\n");
  }
);
client.on("data", (data) => {
  console.log(data.toString());
  client.end();
});
client.on("end", () => {
  console.log("disconnected from server");
});
client.on("error", (error) => {
  console.log(error.toString());
  client.end();
});
```

PS:

- HTTP 是一个文本协议；

```javascript
// Request
class Request {
  // method, url = host + port + path
  // body: key-value
  // headers
  constructor(options) {
    this.method = options.method || "GET";
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || "/";
    this.body = options.body || {};
    this.headers = options.headers || {};
    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    } else if (
      this.headers["Content-Type"] === "application/x-www-form-urlencoded"
    ) {
      this.bodyText = Object.keys(this.body)
        .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
        .join("&");
    }
    this.headers["Content-Length"] = this.bodyText.length;
  }
  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers)
  .map((key) => `${key}: ${this.headers[key]}`)
  .join("\r\n")}\r
\r
${this.bodyText}`;
  }
  send(connection) {
    return new Promise((resolve, reject) => {
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port,
          },
          () => {
            connection.write(this.toString());
          }
        );
        connection.on("data", (data) => {
          resolve(data.toString());
          connection.end();
        });
        connection.on("end", () => {
          console.log("end...");
        });
        connection.on("error", (error) => {
          reject(error);
          connection.end();
        });
      }
    });
  }
}

class Response {}

void (async function () {
  let request = new Request({
    method: "POST",
    host: "localhost",
    port: 8088,
    path: "/",
    headers: {
      ["X-Foo2"]: "customed",
    },
    body: {
      name: "httishere",
    },
  });
  let response = await request.send();
  console.log(response);
})();
```

```javascript
// Response
class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1; // \r
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3; // \r
    this.WAITING_HEADER_VALUE = 4; // \r
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6; // 有两个换行
    this.WAITING_BODY = 7;

    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.bodyParser = null;
  }
  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }
  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join(""),
    };
  }
  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }
  receiveChar(char) {
    // status line (WAITING_STATUS_LINE -> WAITING_STATUS_LINE_END)
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === "\r") {
        this.current = this.WAITING_STATUS_LINE_END;
      } else if (char === "\n") {
        this.current = this.WAITING_HEADER_NAME;
      } else {
        this.statusLine += char;
      }
    }
    // status line ended, and headers start
    else if (this.current === this.WAITING_STATUS_LINE_END && char === "\n") {
      this.current = this.WAITING_HEADER_NAME;
    }
    // get key-value from headers
    else if (this.current === this.WAITING_HEADER_NAME) {
      if (char === ":") {
        this.current = this.WAITING_HEADER_SPACE;
      } else if (char === "\r") {
        // end headers
        this.current = this.WAITING_HEADER_BLOCK_END;
      } else {
        this.headerName += char;
      }
    } else if (
      this.current === this.WAITING_HEADER_BLOCK_END &&
      char === "\n"
    ) {
      this.current = this.WAITING_BODY;
      // body parser creates
      if (this.headers["Transfer-Encoding"] === "chunked") {
        this.bodyParser = new TrunkedBodyParser();
      }
    }
    // one name of the headers ended
    else if (this.current === this.WAITING_HEADER_SPACE && char === " ") {
      this.current = this.WAITING_HEADER_VALUE;
    }
    // header value starts
    else if (this.current === this.WAITING_HEADER_VALUE) {
      if (char === "\r") {
        this.current = this.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        (this.headerName = ""), (this.headerValue = "");
      } else {
        this.headerValue += char;
      }
    }
    // one value of the headers ended
    else if (this.current === this.WAITING_HEADER_LINE_END && char === "\n") {
      this.current = this.WAITING_HEADER_NAME;
    }
    // body starts
    else if (this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char);
    }
  }
}
class TrunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READIND_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;
    this.WAITING_BODY_BLOCK = 5;
    this.WAITING_BODY_BLOCK_END = 6;

    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.current = this.WAITING_LENGTH;
  }
  receiveChar(char) {
    if (this.current === this.WAITING_LENGTH) {
      if (char === "\r") {
        if (this.length === 0) {
          // console.log('finished', this.content)
          this.isFinished = true;
          this.current = this.WAITING_BODY_BLOCK;
        } else {
          this.current = this.WAITING_LENGTH_LINE_END;
        }
      } else {
        this.length *= 10;
        this.length += char.charCodeAt(0) - "0".charCodeAt(0);
      }
    } else if (this.current === this.WAITING_LENGTH_LINE_END && char === "\n") {
      this.current = this.READIND_TRUNK;
    } else if (this.current === this.READIND_TRUNK) {
      this.content.push(char);
      this.length--;
      if (this.length === 0) {
        this.current = this.WAITING_NEW_LINE;
      }
    } else if (this.current === this.WAITING_NEW_LINE && char === "\r") {
      this.current = this.WAITING_NEW_LINE_END;
    } else if (this.current === this.WAITING_NEW_LINE_END && char === "\n") {
      this.current = this.WAITING_LENGTH;
    } else if (this.current === this.WAITING_BODY_BLOCK && char === "\n") {
      this.current = this.WAITING_BODY_BLOCK_END;
    }
  }
}
```

```javascript
// 更新request的data事件
connection.on("data", (data) => {
  parser.receive(data.toString());
  if (parser.isFinished) {
    resolve(parser.response);
    connection.end();
  }
});
```

result:

![](https://gitee.com/httishere/blog-image/raw/master/img/Xnip2021-09-13_20-58-02.jpg#id=FcaP8&originHeight=192&originWidth=485&originalType=binary∶=1&status=done&style=none)

优化：

可以再增加状态机对 body 的`\r\n`进行再优化。

![](https://gitee.com/httishere/blog-image/raw/master/img/Xnip2021-09-13_21-06-24.jpg#id=dEVol&originHeight=191&originWidth=403&originalType=binary∶=1&status=done&style=none)

### 有限状态机

[阮老师的文章](http://www.ruanyifeng.com/blog/2013/09/finite-state_machine_for_javascript.html)，有空可以看看。

- 每个状态都是一个机器
  - 在每个机器里，可以进行计算，存储，输出……
  - 所有机器接受的输入都是一致的
  - 状态机的每个机器本身没有状态（类似纯函数，无副作用）
- 每个机器知道下一个状态
  - 每个机器都有确定的下一个状态（Moore）
  - 每个机器根据输入决定下一个状态（Mealy）

#### 使用有限状态机处理字符串

##### 在一个字符串中，找到字符"a"

```javascript
function findA(str) {
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "a") {
      return true;
    }
  }
  return false;
}
```

##### 在一个字符串中，找到字符"ab"

```javascript
function findAb(str) {
  let findAFlag = false;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "a") {
      findAFlag = true;
    } else if (findAFlag === true && str[i] === "b") {
      return true;
    } else {
      findAFlag = false;
    }
  }
  return false;
}
```

##### 在一个字符串中，找到字符"abcdef"

同上，使用`findAFlag`，`findBFlag`，`findCFlag`，`findDFlag`，`findEFlag`，`findFFlag`几个标志。

#### JS 中的有限状态机（Mealy）

每个函数是一个状态，函数参数就是输入，函数体内可以自由地处理每个状态的逻辑，返回值作为下一个状态。

```javascript
function match(str) {
  let state = start;
  for (let c of str) {
    console.log(c, state);
    state = state(c);
  }
  return state === end;
}
function start(c) {
  if (c === "a") return foundA;
  return start;
}
// trap状态，一般用这种来表示一个最终状态
function end(c) {
  return end;
}

function foundA(c) {
  if (c === "b") return foundB;
  return start;
}

function foundB(c) {
  if (c === "c") return foundC;
  return start;
}
function foundC(c) {
  if (c === "d") return foundD;
  return start;
}
function foundD(c) {
  if (c === "e") return foundE;
  return start;
}
function foundE(c) {
  if (c === "f") return end;
  return start;
}

console.log(match("abcddddef"));
```

#### 如何使用状态机处理类似"abcabx"这样的字符串

#### 如何使用状态机处理类似"abababx"这样的字符串

#### 如何用状态机处理完全未知的 pattern

> 参考：字符串 KMP 算法
