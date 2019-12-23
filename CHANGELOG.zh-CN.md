---
order: 9
title: 更新日志
toc: false
timeline: true
---

`@xbzoom/react-component` 严格遵循 [Semantic Versioning 2.0.0](http://semver.org/lang/zh-CN/) 语义化版本规范。

React组件库 🔥 整体概述、 🌟 新增模块、 💄 模块调整、 🐞 bug修复

#### 发布周期

* 修订版本号：微小改动
* 次版本号：小版本变更
* 主版本号：大版本变更

---

#### 目录
- [1.0.9](#109)
  - [🔥城市插件（SelectCIty）组件优化](#%f0%9f%94%a5%e5%9f%8e%e5%b8%82%e6%8f%92%e4%bb%b6selectcity%e7%bb%84%e4%bb%b6%e4%bc%98%e5%8c%96)
- [1.0.8](#108)
  - [🔥城市插件（SelectCIty）组件增加搜索为空时的自定义提示](#%f0%9f%94%a5%e5%9f%8e%e5%b8%82%e6%8f%92%e4%bb%b6selectcity%e7%bb%84%e4%bb%b6%e5%a2%9e%e5%8a%a0%e6%90%9c%e7%b4%a2%e4%b8%ba%e7%a9%ba%e6%97%b6%e7%9a%84%e8%87%aa%e5%ae%9a%e4%b9%89%e6%8f%90%e7%a4%ba)
- [1.0.7](#107)
  - [🔥日历（Calendar）组件增加年份快速选择功能](#%f0%9f%94%a5%e6%97%a5%e5%8e%86calendar%e7%bb%84%e4%bb%b6%e5%a2%9e%e5%8a%a0%e5%b9%b4%e4%bb%bd%e5%bf%ab%e9%80%9f%e9%80%89%e6%8b%a9%e5%8a%9f%e8%83%bd)
- [1.0.6](#106)
  - [🔥日历（Calendar）组件优化](#%f0%9f%94%a5%e6%97%a5%e5%8e%86calendar%e7%bb%84%e4%bb%b6%e4%bc%98%e5%8c%96)
- [1.0.5](#105)
  - [🔥项目添加规范( prettier, eslint, husky, precommit )](#%f0%9f%94%a5%e9%a1%b9%e7%9b%ae%e6%b7%bb%e5%8a%a0%e8%a7%84%e8%8c%83-prettier-eslint-husky-precommit)
- [1.0.4](#104)
  - [🔥项目添加规范( prettier, eslint, husky, precommit )](#%f0%9f%94%a5%e9%a1%b9%e7%9b%ae%e6%b7%bb%e5%8a%a0%e8%a7%84%e8%8c%83-prettier-eslint-husky-precommit--1)
- [1.0.3](#103)
  - [🔥组件库迁移](#%f0%9f%94%a5%e7%bb%84%e4%bb%b6%e5%ba%93%e8%bf%81%e7%a7%bb)
- [1.0.0](#100)
  - [🔥丰富及优化组件库](#%f0%9f%94%a5%e4%b8%b0%e5%af%8c%e5%8f%8a%e4%bc%98%e5%8c%96%e7%bb%84%e4%bb%b6%e5%ba%93)
- [0.9.0](#090)
  - [🔥添加日历组件](#%f0%9f%94%a5%e6%b7%bb%e5%8a%a0%e6%97%a5%e5%8e%86%e7%bb%84%e4%bb%b6)
- [0.5.0](#050)
  - [🔥实现按需加载](#%f0%9f%94%a5%e5%ae%9e%e7%8e%b0%e6%8c%89%e9%9c%80%e5%8a%a0%e8%bd%bd)
- [0.1.0](#010)
  - [🔥项目脚手架初步搭建](#%f0%9f%94%a5%e9%a1%b9%e7%9b%ae%e8%84%9a%e6%89%8b%e6%9e%b6%e5%88%9d%e6%ad%a5%e6%90%ad%e5%bb%ba)

---

## 1.0.9

`2019-12-23`

### 🔥城市插件（SelectCIty）组件优化

- 💄新增筛选时，先清除原先选择的城市，并调用onChange
- 💄点击城市时，清除原先选中的热门城市
- 🐞修复模糊搜索简拼问题

---

## 1.0.8

`2019-12-20`

### 🔥城市插件（SelectCIty）组件增加搜索为空时的自定义提示

---

## 1.0.7

`2019-12-16`

### 🔥日历（Calendar）组件增加年份快速选择功能

- 🐞修复城市插件ts类型错误

---

## 1.0.6

`2019-12-13`

### 🔥日历（Calendar）组件优化

---

## 1.0.5

`2019-12-12`

### 🔥项目添加规范( prettier, eslint, husky, precommit )

- 💄完善项目开发规范，提交时代码规范检查

---

## 1.0.4

`2019-12-12`

### 🔥项目添加规范( prettier, eslint, husky, precommit )

- 💄完善项目开发规范，提交时代码规范检查

---

## 1.0.3

`2019-11-29`

### 🔥组件库迁移

- 💄@nextlc -> @xbzoom
- 💄图标库更新

---

## 1.0.0

`2019-11-29`

### 🔥丰富及优化组件库

- 🌟添加城市选择（SelectCity）组件
- 🌟图片查看组件（Zimage）组件
- 🌟添加输入框（Input）组件
- 🌟添加加载（Spin）组件
- 💄公共类型提取
- 💄fetch封账
- 💄丰富util
- 💄优化SelectCity样式
- 💄因内部引用的antd依赖，会导致打包的项目过大，移除antd依赖
- 🐞修复SelectCity在chorme下部分样式错误

---

## 0.9.0

`2019-10-14`

### 🔥添加日历组件

- 🌟添加日历（Calendar）组件
- 🌟丰富util

---

## 0.5.0

`2019-09-30`

### 🔥实现按需加载

- 🌟打包成umd es lib 并兼容babel-import-plugin

---

## 0.1.0

`2019-09-03`

### 🔥项目脚手架初步搭建

- 🌟webpack4 + gulp