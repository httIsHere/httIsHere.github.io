---
title: 「ROAD 6」HTML
urlname: iclyhn
date: '2021-12-20 16:56:29 +0800'
tags:
  - ROAD 6
categories:
  - 大前端
---

> 定义：XML 和 SGML。

### namespace

### HTML 标签-语义

### HTML 语法

#### 合法元素

- Element：`<tag></tag>`
- Text：`text`
- Comment：`<!-- comments -->`
- DocunmentType：`<!DOCTYPE html>`
- ProcessingInstruction：`<?a 1?>`
- CDATA：`<![CDATA[]]>`

#### 字符引用

- `¡`
- `&`
- `<`
- `"`

![]([https://gitee.com/httishere/blog-image/raw/master/img/image](https://gitee.com/httishere/blog-image/raw/master/img/image) (1).png)

`DocumentFragment`不存在任何 DOM 树上，但是也非常有用，它常常被用来高性能地批量添加节点。

### DOM API

#### 导航类操作（可能会实时变化）

- parentNode
- childNodes
- firstChild
- lastChild
- nextSibling
- previousSibling

#### 修改操作

- appendChild
- insertBefore
- removeChild
- replaceChild

PS：一个 Element 只有一个父元素，不可以被多次 append 或者 insert，如果重复 insert 的话会默认从之前的位置 remove 再 insert 到新位置。

#### 高级操作

- compareDocumentPosition：用于比较两个节点中关系的函数。
- contains：检查一个节点是否包含另一个节点的函数。
- isEqualNode：检查两个节点是否完全相同。
- isSameNode：检查两个节点是否是同一个节点，实际上在 JavaScript 中可以用“===”。
- cloneNode：复制一个节点，如果传入参数 true，则会连同子元素做深拷贝。

### [Events](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget)

- 捕获过程（从 Root 节点开始找到目标节点）
- 冒泡过程（从目标节点向上触发事件）

同一元素上先捕获再冒泡。

### Range

> 问题：如何把一个元素的所有子元素逆序。
>
> 我的解法：

```html
<div id="root">
  <span>1</span>
  <div>2</div>
  <p>3</p>
  <em>4</em>
  <a href="#">5</a>
</div>
<script>
  let element = document.getElementById("root");

  function reverseChildren(element) {
    let child = element.childNodes;
    let len = child.length;
    while (len--) {
      // 不需要先去remove
      element.appendChild(child[len - 1]);
    }
  }

  reverseChildren(element);
</script>
```

`Range API`也是隶属于`DOM API`，`Range API`表示一个 HTML 上的范围，这个范围是以**文字**为最小单位的，所以 Range 不一定包含完整的节点，它可能是 Text 节点中的一段，也可以是头尾两个 Text 的一部分加上中间的元素。

```javascript
var range = new Range();
range.setStart(element, 9);
range.setEnd(element, 4);

// 可以从用户选中区域创建，这样的 Range 用于处理用户选中区域
let range = document.getSelection().getRangeAt(0);
```

#### 主要 API：

- `[Range.setStart()](https://developer.mozilla.org/zh-CN/docs/Web/API/Range/setStart)`：“设置 `Range` 的起点。
- `[Range.setEnd()](https://developer.mozilla.org/zh-CN/docs/Web/API/Range/setEnd)`：设置 `Range` 的终点。

#### 辅助 API：

- `[Range.setStartBefore()](https://developer.mozilla.org/zh-CN/docs/Web/API/Range/setStartBefore)`：以其它`[节点](https://developer.mozilla.org/zh-CN/docs/Web/API/Node)`为基准，设置 `Range` 的起点。
- `[Range.setStartAfter()](https://developer.mozilla.org/en-US/docs/Web/API/Range/setStartAfter)`[ (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/Range/setStartAfter)：以其它`[节点](https://developer.mozilla.org/zh-CN/docs/Web/API/Node)`为基准，设置 `Range` 的起点。
- `[Range.setEndBefore()](https://developer.mozilla.org/en-US/docs/Web/API/Range/setEndBefore)`[ (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/Range/setEndBefore)：以其它`[节点](https://developer.mozilla.org/zh-CN/docs/Web/API/Node)`为基准，设置 `Range` 的终点。
- `[Range.setEndAfter()](https://developer.mozilla.org/en-US/docs/Web/API/Range/setEndAfter)`[ (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/Range/setEndAfter)：以其它`[节点](https://developer.mozilla.org/zh-CN/docs/Web/API/Node)`为基准，设置 `Range` 的终点。
- `[Range.selectNode()](https://developer.mozilla.org/zh-CN/docs/Web/API/Range/selectNode)`：使 `Range` 包含某个`[节点](https://developer.mozilla.org/zh-CN/docs/Web/API/Node)`及其内容。
- `[Range.selectNodeContents()](https://developer.mozilla.org/zh-CN/docs/Web/API/Range/selectNodeContents)`：使 `Range` 包含某个`[节点](https://developer.mozilla.org/zh-CN/docs/Web/API/Node)`的内容。
- `[Range.extractContents()](https://developer.mozilla.org/zh-CN/docs/Web/API/Range/extractContents)`：把 `Range` 的内容从文档树移动到一个`[文档片段](https://developer.mozilla.org/zh-CN/docs/Web/API/DocumentFragment)`中。

#### 使用`Range API`解决开头的问题：

```javascript
// 减少对DOM树操作的次数
function reverseChildrenByRange(element) {
  let range = new Range();
  range.selectNodeContents(element); // 选取所有子节点
  let fragment = range.extractContents(); // 移至文档片段
  let l = fragment.childNodes.length;
  while (l--) {
    fragment.appendChild(fragment.childNodes[l]);
  }
  element.appendChild(fragment);
}
```

实践：适合类似富文本之类的开发。

### CSSOM

#### `document.styleSheets`

#### Rules

- `document.styleSheets[0].cssRules`
- `document.styleSheets[0].insertRule("p {color: pink}", 0)`，insert 的是字符串
- `document.styleSheets[0].removeRule(0)`

#### Rule

- CSSStyleRule
- CSSCharsetRule
- CSSImportRule
- ...

##### CSSStyleRule

- selectorText: String
- style: k-v 结构

#### [getComputedStyle](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle)

- `window.getComputedStyle(elt, pseudoElt);`
  - elt: 想要获取的元素
  - pseudoElt（可选）：指定一个要匹配的伪元素的字符串

### window API

- `window.open()`: `window.open('about:blank', '_blank')`
- `widnow.moveBy()`
- `widnow.moveTo()`
- `window.close()`
- ...还有部分滚动相关 API

### 获取所有 API

```javascript
let names = Object.getOwnPropertyNames(window);

function filterOut(names, props) {
  let set = new Set();
  props.forEach((o) => set.add(o));
  return names.filter((e) => !set.has(e));
}

// ECMA 262
{
  let js = new Set();
  let objects = [
    "globalThis",
    "console",
    "BigInt",
    "BigInt64Array",
    "BigUint64Array",
    "Infinity",
    "NaN",
    "undefined",
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "Array",
    "Date",
    "RegExp",
    "Promise",
    "Proxy",
    "Map",
    "WeakMap",
    "Set",
    "WeakSet",
    "Function",
    "Boolean",
    "String",
    "Number",
    "Symbol",
    "Object",
    "Error",
    "EvalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError",
    "ArrayBuffer",
    "SharedArrayBuffer",
    "DataView",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Uint8Array",
    "Uint16Array",
    "Uint32Array",
    "Uint8ClampedArray",
    "Atomics",
    "JSON",
    "Math",
    "Reflect",
    "escape",
    "unescape",
  ];
  objects.forEach((o) => js.add(o));
  names = names.filter((e) => !js.has(e));
}

names = names
  .filter((e) => {
    try {
      return !(window[e].prototype instanceof Node);
    } catch (err) {
      return true;
    }
  })
  .filter((e) => e != "Node");

names = names.filter((e) => !e.match(/^on/));

names = names.filter((e) => !e.match(/^webkit/));

//https://html.spec.whatwg.org/#window

{
  let names = Object.getOwnPropertyNames(window);
  let js = new Set();
  let objects = [
    "BigInt",
    "BigInt64Array",
    "BigUint64Array",
    "Infinity",
    "NaN",
    "undefined",
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "Array",
    "Date",
    "RegExp",
    "Promise",
    "Proxy",
    "Map",
    "WeakMap",
    "Set",
    "WeakSet",
    "Function",
    "Boolean",
    "String",
    "Number",
    "Symbol",
    "Object",
    "Error",
    "EvalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError",
    "ArrayBuffer",
    "SharedArrayBuffer",
    "DataView",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Uint8Array",
    "Uint16Array",
    "Uint32Array",
    "Uint8ClampedArray",
    "Atomics",
    "JSON",
    "Math",
    "Reflect",
    "escape",
    "unescape",
  ];
  objects.forEach((o) => js.add(o));
  names = names.filter((e) => !js.has(e));

  names = names
    .filter((e) => {
      try {
        return !(window[e].prototype instanceof Node);
      } catch (err) {
        return true;
      }
    })
    .filter((e) => e != "Node");

  let windowprops = new Set();
  objects = [
    "window",
    "self",
    "document",
    "name",
    "location",
    "history",
    "customElements",
    "locationbar",
    "menubar",
    " personalbar",
    "scrollbars",
    "statusbar",
    "toolbar",
    "status",
    "close",
    "closed",
    "stop",
    "focus",
    " blur",
    "frames",
    "length",
    "top",
    "opener",
    "parent",
    "frameElement",
    "open",
    "navigator",
    "applicationCache",
    "alert",
    "confirm",
    "prompt",
    "print",
    "postMessage",
    "console",
  ];
  objects.forEach((o) => windowprops.add(o));
  names = names.filter((e) => !windowprops.has(e));
}

//https://html.spec.whatwg.org/

{
  let interfaces = new Set();
  objects = [
    "ApplicationCache",
    "AudioTrack",
    "AudioTrackList",
    "BarProp",
    "BeforeUnloadEvent",
    "BroadcastChannel",
    "CanvasGradient",
    "CanvasPattern",
    "CanvasRenderingContext2D",
    "CloseEvent",
    "CustomElementRegistry",
    "DOMStringList",
    "DOMStringMap",
    "DataTransfer",
    "DataTransferItem",
    "DataTransferItemList",
    "DedicatedWorkerGlobalScope",
    "Document",
    "DragEvent",
    "ErrorEvent",
    "EventSource",
    "External",
    "FormDataEvent",
    "HTMLAllCollection",
    "HashChangeEvent",
    "History",
    "ImageBitmap",
    "ImageBitmapRenderingContext",
    "ImageData",
    "Location",
    "MediaError",
    "MessageChannel",
    "MessageEvent",
    "MessagePort",
    "MimeType",
    "MimeTypeArray",
    "Navigator",
    "OffscreenCanvas",
    "OffscreenCanvasRenderingContext2D",
    "PageTransitionEvent",
    "Path2D",
    "Plugin",
    "PluginArray",
    "PopStateEvent",
    "PromiseRejectionEvent",
    "RadioNodeList",
    "SharedWorker",
    "SharedWorkerGlobalScope",
    "Storage",
    "StorageEvent",
    "TextMetrics",
    "TextTrack",
    "TextTrackCue",
    "TextTrackCueList",
    "TextTrackList",
    "TimeRanges",
    "TrackEvent",
    "ValidityState",
    "VideoTrack",
    "VideoTrackList",
    "WebSocket",
    "Window",
    "Worker",
    "WorkerGlobalScope",
    "WorkerLocation",
    "WorkerNavigator",
  ];
  objects.forEach((o) => interfaces.add(o));

  names = names.filter((e) => !interfaces.has(e));
}

//http://www.ecma-international.org/ecma-402/5.0/index.html#Title

names = names.filter((e) => e != "Intl");

//https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15

names = filterOut(names, [
  "WebGLVertexArrayObject",
  "WebGLTransformFeedback",
  "WebGLSync",
  "WebGLSampler",
  "WebGLQuery",
  "WebGL2RenderingContext",
  "WebGLContextEvent",
  "WebGLObject",
  "WebGLBuffer",
  "WebGLFramebuffer",
  "WebGLProgram",
  "WebGLRenderbuffer",
  "WebGLShader",
  "WebGLTexture",
  "WebGLUniformLocation",
  "WebGLActiveInfo",
  "WebGLShaderPrecisionFormat",
  "WebGLRenderingContext",
]);

//https://www.w3.org/TR/webaudio/

names = filterOut(names, [
  "AudioContext",
  "AudioNode",
  "AnalyserNode",
  "AudioBuffer",
  "AudioBufferSourceNode",
  "AudioDestinationNode",
  "AudioParam",
  "AudioListener",
  "AudioWorklet",
  "AudioWorkletGlobalScope",
  "AudioWorkletNode",
  "AudioWorkletProcessor",
  "BiquadFilterNode",
  "ChannelMergerNode",
  "ChannelSplitterNode",
  "ConstantSourceNode",
  "ConvolverNode",
  "DelayNode",
  "DynamicsCompressorNode",
  "GainNode",
  "IIRFilterNode",
  "MediaElementAudioSourceNode",
  "MediaStreamAudioSourceNode",
  "MediaStreamTrackAudioSourceNode",
  "MediaStreamAudioDestinationNode",
  "PannerNode",
  "PeriodicWave",
  "OscillatorNode",
  "StereoPannerNode",
  "WaveShaperNode",
  "ScriptProcessorNode",
  "AudioProcessingEvent",
]);

//https://encoding.spec.whatwg.org/#dom-textencoder

names = filterOut(names, [
  "TextDecoder",
  "TextEncoder",
  "TextDecoderStream",
  "TextEncoderStream",
]);

//https://streams.spec.whatwg.org/#blqs-class

names = filterOut(names, [
  "ReadableStream",
  "ReadableStreamDefaultReader",
  "ReadableStreamBYOBReader",
  "ReadableStreamDefaultController",
  "ReadableByteStreamController",
  "ReadableStreamBYOBRequest",
  "WritableStream",
  "WritableStreamDefaultWriter",
  "WritableStreamDefaultController",
  "TransformStream",
  "TransformStreamDefaultController",
  "ByteLengthQueuingStrategy",
  "CountQueuingStrategy",
]);

//https://wicg.github.io/BackgroundSync/spec/#sync-manager-interface

names = filterOut(names, ["SyncManager"]);
```
