---
order: 9
title: 更新日志
toc: false
timeline: true
---

`@xbzoom/react-component` strictly follow [Semantic Versioning 2.0.0](http://semver.org/lang/zh-CN/) semantic version specification.

React component library 🔥 overall overview, new module, 💄 module 🌟 adjustment, 🐞 bug fixes

#### Release cycle

* Revision number: minor change
* Minor version number: minor version change
* Major version number: major version change

---

#### Directory
- [1.0.9](#109)
  - [🔥City plug-in (SelectCIty) component optimization](#%f0%9f%94%a5city-plug-in-selectcity-component-optimization)
- [1.0.8](#108)
  - [🔥City plug-in (SelectCIty) component adds custom prompts when the search is empty](#%f0%9f%94%a5city-plug-in-selectcity-component-adds-custom-prompts-when-the-search-is-empty)
- [1.0.7](#107)
  - [🔥Calendar (Calendar) components added fast year selection feature](#%f0%9f%94%a5calendar-calendar-components-added-fast-year-selection-feature)
- [1.0.6](#106)
  - [🔥Calendar (Calendar) components optimize](#%f0%9f%94%a5calendar-calendar-components-optimize)
- [1.0.5](#105)
  - [🔥Program to add specification( prettier, eslint, husky, precommit )](#%f0%9f%94%a5program-to-add-specification-prettier-eslint-husky-precommit)
- [1.0.4](#104)
  - [🔥Program to add specification( prettier, eslint, husky, precommit )](#%f0%9f%94%a5program-to-add-specification-prettier-eslint-husky-precommit--1)
- [1.0.3](#103)
  - [🔥Component library migration](#%f0%9f%94%a5component-library-migration)
- [1.0.0](#100)
  - [🔥Enrich and optimize the component library](#%f0%9f%94%a5enrich-and-optimize-the-component-library)
- [0.9.0](#090)
  - [🔥Add a calendar component](#%f0%9f%94%a5add-a-calendar-component)
- [0.5.0](#050)
  - [🔥Implement on-demand loading](#%f0%9f%94%a5implement-on-demand-loading)
- [0.1.0](#010)
  - [🔥Preliminary construction of project scaffolding](#%f0%9f%94%a5preliminary-construction-of-project-scaffolding)

---

## 1.0.9

`2019-12-23`

### 🔥City plug-in (SelectCIty) component optimization

- 💄 New screen, first remove the original choice of cities, and call the onChange
- 💄 Click the city to remove the selected original hot city
- 🐞 Repair fuzzy search everyday problems

---

## 1.0.8

`2019-12-20`

### 🔥City plug-in (SelectCIty) component adds custom prompts when the search is empty

---

## 1.0.7

`2019-12-16`

### 🔥Calendar (Calendar) components added fast year selection feature

- 🐞Fixed city plugin ts type error

---

## 1.0.6

`2019-12-13`

### 🔥Calendar (Calendar) components optimize

---

## 1.0.5

`2019-12-12`

### 🔥Program to add specification( prettier, eslint, husky, precommit )

- 💄 When improve project development rules, submit code standard inspection
  
---

## 1.0.4

`2019-12-12`

### 🔥Program to add specification( prettier, eslint, husky, precommit )

- 💄 When improve project development rules, submit code standard inspection

---

## 1.0.3

`2019-11-29`

### 🔥Component library migration

- 💄@nextlc -> @xbzoom
- 💄Icon library update


---

## 1.0.0

`2019-11-29`

### 🔥Enrich and optimize the component library

- 🌟 Added city choice (SelectCity) components
- 🌟 Image view components (Zimage) components
- 🌟 Add Input (Input) box components
- 🌟 Added load (Spin) components
- 💄 Extraction public type
- 💄 Fetch account
- 💄 Rich util
- 💄 Optimization SelectCity style
- 💄 For internal reference antd rely on, will lead to excessive packaging project, remove antd dependency
- 🐞 Part repair SelectCity under chorme style errors

---

## 0.9.0

`2019-10-14`

### 🔥Add a calendar component

- 🌟 Added Calendar (Calendar) components
- 🌟 Rich util

---

## 0.5.0

`2019-09-30`

### 🔥Implement on-demand loading

- 🌟Packaged as umd es lib and compatible with babel-import-plugin

---

## 0.1.0

`2019-09-03`

### 🔥Preliminary construction of project scaffolding

- 🌟webpack4 + gulp