---
title: 1971.find-if-path-exists-in-graph
date: 2021-12-10 17:33:12
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---


### Description

> There is a bi-directional graph with n vertices, where each vertex is labeled from 0 to n - 1 (inclusive). The edges in the graph are represented as a 2D integer array edges, where each edges[i] = [ui, vi] denotes a bi-directional edge between vertex ui and vertex vi. Every vertex pair is connected by at most one edge, and no vertex has an edge to itself.
> 
> You want to determine if there is a valid path that exists from vertex start to vertex end.
> 
> Given edges and the integers n, start, and end, return true if there is a valid path from start to end, or false otherwise.
> 
> 有一个具有 n个顶点的 双向 图，其中每个顶点标记从 0 到 n - 1（包含 0 和 n - 1）。图中的边用一个二维整数数组 edges 表示，其中 edges[i] = [ui, vi] 表示顶点 ui 和顶点 vi 之间的双向边。 每个顶点对由 最多一条 边连接，并且没有顶点存在与自身相连的边。
> 
> 请你确定是否存在从顶点 start 开始，到顶点 end 结束的 有效路径 。
> 
> 给你数组 edges 和整数 n、start和end，如果从 start 到 end 存在 有效路径 ，则返回 true，否则返回 false 。
> ![](https://gitee.com/httishere/blog-image/raw/master/img/validpath-ex2.png)


### Examples

```bash
# Example 1
Input: n = 3, edges = [[0,1],[1,2],[2,0]], start = 0, end = 2
Output: true
Explanation: There are two paths from vertex 0 to vertex 2:
- 0 → 1 → 2
- 0 → 2

# Example 2
Input: n = 6, edges = [[0,1],[0,2],[3,5],[5,4],[4,3]], start = 0, end = 5
Output: false
Explanation: There is no path from vertex 0 to vertex 5.
```

### Solution

首先使用提供的边，基于顶点收集该定点相邻的顶点。

再从目标起点出发，对相邻及其相邻的顶点进行查询，最后查看终点是否被查询。

```js
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number} start
 * @param {number} end
 * @return {boolean}
 */
var validPath = function(n, edges, start, end) {
    if(start === end) return true;
    let globals = {}, visited = {};
    // 收集各个顶点的边
    for(let i = 0; i < edges.length; i++) {
        let u = edges[i][0], v = edges[i][1];
        !globals[u] ? globals[u] = [v] : globals[u].push(v);
        !globals[v] ? globals[v] = [u] : globals[v].push(u);
    }
    // 从起点开始递归查询子顶点经过的路径
    dfs(start, visited);
    // 经过的点都被做上查询标记
    // 若终点无标记则说明从未被访问，即无路径抵达终点
    return visited[end] ? true : false;
    function dfs(vertex, visited) {
        // 已查询顶点标记
        if(visited[vertex]) return;
        visited[vertex] = true;
        for(let child of globals[vertex]) {
            dfs(child, visited);
        }
    }
};
```

### Result

> Accepted
> 
> 25/25 cases passed (1124 ms)
> 
> Your runtime beats 13.18 % of javascript submissions
> 
> Your memory usage beats 22.08 % of javascript submissions (157.1 MB)