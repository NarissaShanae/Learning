(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/@11ty/eleventy-navigation/package.json
  var require_package = __commonJS({
    "node_modules/@11ty/eleventy-navigation/package.json"(exports, module) {
      module.exports = {
        name: "@11ty/eleventy-navigation",
        version: "0.3.5",
        publishConfig: {
          access: "public"
        },
        description: "A plugin for creating hierarchical navigation in Eleventy projects. Supports breadcrumbs too!",
        main: ".eleventy.js",
        scripts: {
          test: "npx ava",
          sample: "npx @11ty/eleventy --input=sample --output=sample/_site --config=sample/.eleventy.js"
        },
        repository: {
          type: "git",
          url: "git+https://github.com/11ty/eleventy-navigation.git"
        },
        bugs: {
          url: "https://github.com/11ty/eleventy-navigation/issues"
        },
        homepage: "https://www.11ty.dev/docs/plugins/navigation/",
        funding: {
          type: "opencollective",
          url: "https://opencollective.com/11ty"
        },
        keywords: [
          "eleventy",
          "eleventy-plugin"
        ],
        author: {
          name: "Zach Leatherman",
          email: "zachleatherman@gmail.com",
          url: "https://zachleat.com/"
        },
        license: "MIT",
        "11ty": {
          compatibility: ">=0.7 || >=1.0.0-canary"
        },
        devDependencies: {
          ava: "^3.15.0"
        },
        dependencies: {
          "dependency-graph": "^0.11.0"
        },
        ava: {
          files: [
            "./test/*.js"
          ],
          ignoredByWatcher: [
            "./*.js"
          ]
        }
      };
    }
  });

  // node_modules/dependency-graph/lib/dep_graph.js
  var require_dep_graph = __commonJS({
    "node_modules/dependency-graph/lib/dep_graph.js"(exports) {
      function createDFS(edges, leavesOnly, result, circular) {
        var visited = {};
        return function(start) {
          if (visited[start]) {
            return;
          }
          var inCurrentPath = {};
          var currentPath = [];
          var todo = [];
          todo.push({ node: start, processed: false });
          while (todo.length > 0) {
            var current = todo[todo.length - 1];
            var processed = current.processed;
            var node = current.node;
            if (!processed) {
              if (visited[node]) {
                todo.pop();
                continue;
              } else if (inCurrentPath[node]) {
                if (circular) {
                  todo.pop();
                  continue;
                }
                currentPath.push(node);
                throw new DepGraphCycleError(currentPath);
              }
              inCurrentPath[node] = true;
              currentPath.push(node);
              var nodeEdges = edges[node];
              for (var i = nodeEdges.length - 1; i >= 0; i--) {
                todo.push({ node: nodeEdges[i], processed: false });
              }
              current.processed = true;
            } else {
              todo.pop();
              currentPath.pop();
              inCurrentPath[node] = false;
              visited[node] = true;
              if (!leavesOnly || edges[node].length === 0) {
                result.push(node);
              }
            }
          }
        };
      }
      var DepGraph = exports.DepGraph = function DepGraph2(opts) {
        this.nodes = {};
        this.outgoingEdges = {};
        this.incomingEdges = {};
        this.circular = opts && !!opts.circular;
      };
      DepGraph.prototype = {
        /**
         * The number of nodes in the graph.
         */
        size: function() {
          return Object.keys(this.nodes).length;
        },
        /**
         * Add a node to the dependency graph. If a node already exists, this method will do nothing.
         */
        addNode: function(node, data) {
          if (!this.hasNode(node)) {
            if (arguments.length === 2) {
              this.nodes[node] = data;
            } else {
              this.nodes[node] = node;
            }
            this.outgoingEdges[node] = [];
            this.incomingEdges[node] = [];
          }
        },
        /**
         * Remove a node from the dependency graph. If a node does not exist, this method will do nothing.
         */
        removeNode: function(node) {
          if (this.hasNode(node)) {
            delete this.nodes[node];
            delete this.outgoingEdges[node];
            delete this.incomingEdges[node];
            [this.incomingEdges, this.outgoingEdges].forEach(function(edgeList) {
              Object.keys(edgeList).forEach(function(key) {
                var idx = edgeList[key].indexOf(node);
                if (idx >= 0) {
                  edgeList[key].splice(idx, 1);
                }
              }, this);
            });
          }
        },
        /**
         * Check if a node exists in the graph
         */
        hasNode: function(node) {
          return this.nodes.hasOwnProperty(node);
        },
        /**
         * Get the data associated with a node name
         */
        getNodeData: function(node) {
          if (this.hasNode(node)) {
            return this.nodes[node];
          } else {
            throw new Error("Node does not exist: " + node);
          }
        },
        /**
         * Set the associated data for a given node name. If the node does not exist, this method will throw an error
         */
        setNodeData: function(node, data) {
          if (this.hasNode(node)) {
            this.nodes[node] = data;
          } else {
            throw new Error("Node does not exist: " + node);
          }
        },
        /**
         * Add a dependency between two nodes. If either of the nodes does not exist,
         * an Error will be thrown.
         */
        addDependency: function(from, to) {
          if (!this.hasNode(from)) {
            throw new Error("Node does not exist: " + from);
          }
          if (!this.hasNode(to)) {
            throw new Error("Node does not exist: " + to);
          }
          if (this.outgoingEdges[from].indexOf(to) === -1) {
            this.outgoingEdges[from].push(to);
          }
          if (this.incomingEdges[to].indexOf(from) === -1) {
            this.incomingEdges[to].push(from);
          }
          return true;
        },
        /**
         * Remove a dependency between two nodes.
         */
        removeDependency: function(from, to) {
          var idx;
          if (this.hasNode(from)) {
            idx = this.outgoingEdges[from].indexOf(to);
            if (idx >= 0) {
              this.outgoingEdges[from].splice(idx, 1);
            }
          }
          if (this.hasNode(to)) {
            idx = this.incomingEdges[to].indexOf(from);
            if (idx >= 0) {
              this.incomingEdges[to].splice(idx, 1);
            }
          }
        },
        /**
         * Return a clone of the dependency graph. If any custom data is attached
         * to the nodes, it will only be shallow copied.
         */
        clone: function() {
          var source = this;
          var result = new DepGraph();
          var keys = Object.keys(source.nodes);
          keys.forEach(function(n) {
            result.nodes[n] = source.nodes[n];
            result.outgoingEdges[n] = source.outgoingEdges[n].slice(0);
            result.incomingEdges[n] = source.incomingEdges[n].slice(0);
          });
          return result;
        },
        /**
         * Get an array containing the direct dependencies of the specified node.
         *
         * Throws an Error if the specified node does not exist.
         */
        directDependenciesOf: function(node) {
          if (this.hasNode(node)) {
            return this.outgoingEdges[node].slice(0);
          } else {
            throw new Error("Node does not exist: " + node);
          }
        },
        /**
         * Get an array containing the nodes that directly depend on the specified node.
         *
         * Throws an Error if the specified node does not exist.
         */
        directDependantsOf: function(node) {
          if (this.hasNode(node)) {
            return this.incomingEdges[node].slice(0);
          } else {
            throw new Error("Node does not exist: " + node);
          }
        },
        /**
         * Get an array containing the nodes that the specified node depends on (transitively).
         *
         * Throws an Error if the graph has a cycle, or the specified node does not exist.
         *
         * If `leavesOnly` is true, only nodes that do not depend on any other nodes will be returned
         * in the array.
         */
        dependenciesOf: function(node, leavesOnly) {
          if (this.hasNode(node)) {
            var result = [];
            var DFS = createDFS(
              this.outgoingEdges,
              leavesOnly,
              result,
              this.circular
            );
            DFS(node);
            var idx = result.indexOf(node);
            if (idx >= 0) {
              result.splice(idx, 1);
            }
            return result;
          } else {
            throw new Error("Node does not exist: " + node);
          }
        },
        /**
         * get an array containing the nodes that depend on the specified node (transitively).
         *
         * Throws an Error if the graph has a cycle, or the specified node does not exist.
         *
         * If `leavesOnly` is true, only nodes that do not have any dependants will be returned in the array.
         */
        dependantsOf: function(node, leavesOnly) {
          if (this.hasNode(node)) {
            var result = [];
            var DFS = createDFS(
              this.incomingEdges,
              leavesOnly,
              result,
              this.circular
            );
            DFS(node);
            var idx = result.indexOf(node);
            if (idx >= 0) {
              result.splice(idx, 1);
            }
            return result;
          } else {
            throw new Error("Node does not exist: " + node);
          }
        },
        /**
         * Construct the overall processing order for the dependency graph.
         *
         * Throws an Error if the graph has a cycle.
         *
         * If `leavesOnly` is true, only nodes that do not depend on any other nodes will be returned.
         */
        overallOrder: function(leavesOnly) {
          var self = this;
          var result = [];
          var keys = Object.keys(this.nodes);
          if (keys.length === 0) {
            return result;
          } else {
            if (!this.circular) {
              var CycleDFS = createDFS(this.outgoingEdges, false, [], this.circular);
              keys.forEach(function(n) {
                CycleDFS(n);
              });
            }
            var DFS = createDFS(
              this.outgoingEdges,
              leavesOnly,
              result,
              this.circular
            );
            keys.filter(function(node) {
              return self.incomingEdges[node].length === 0;
            }).forEach(function(n) {
              DFS(n);
            });
            if (this.circular) {
              keys.filter(function(node) {
                return result.indexOf(node) === -1;
              }).forEach(function(n) {
                DFS(n);
              });
            }
            return result;
          }
        },
        /**
         * Get an array of nodes that have no dependants (i.e. nothing depends on them).
         */
        entryNodes: function() {
          var self = this;
          return Object.keys(this.nodes).filter(function(node) {
            return self.incomingEdges[node].length === 0;
          });
        }
      };
      DepGraph.prototype.directDependentsOf = DepGraph.prototype.directDependantsOf;
      DepGraph.prototype.dependentsOf = DepGraph.prototype.dependantsOf;
      var DepGraphCycleError = exports.DepGraphCycleError = function(cyclePath) {
        var message = "Dependency Cycle Found: " + cyclePath.join(" -> ");
        var instance = new Error(message);
        instance.cyclePath = cyclePath;
        Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
        if (Error.captureStackTrace) {
          Error.captureStackTrace(instance, DepGraphCycleError);
        }
        return instance;
      };
      DepGraphCycleError.prototype = Object.create(Error.prototype, {
        constructor: {
          value: Error,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      Object.setPrototypeOf(DepGraphCycleError, Error);
    }
  });

  // node_modules/@11ty/eleventy-navigation/eleventy-navigation.js
  var require_eleventy_navigation = __commonJS({
    "node_modules/@11ty/eleventy-navigation/eleventy-navigation.js"(exports, module) {
      var DepGraph = require_dep_graph().DepGraph;
      function findNavigationEntries(nodes = [], key = "") {
        let pages = [];
        for (let entry of nodes) {
          if (entry.data && entry.data.eleventyNavigation) {
            let nav = entry.data.eleventyNavigation;
            if (!key && !nav.parent || nav.parent === key) {
              pages.push(Object.assign({}, nav, {
                url: nav.url || entry.data.page.url,
                pluginType: "eleventy-navigation"
              }, key ? { parentKey: key } : {}));
            }
          }
        }
        return pages.sort(function(a, b) {
          return (a.order || 0) - (b.order || 0);
        }).map(function(entry) {
          if (!entry.title) {
            entry.title = entry.key;
          }
          if (entry.key) {
            entry.children = findNavigationEntries(nodes, entry.key);
          }
          return entry;
        });
      }
      function findDependencies(pages, depGraph, parentKey) {
        for (let page of pages) {
          depGraph.addNode(page.key, page);
          if (parentKey) {
            depGraph.addDependency(page.key, parentKey);
          }
          if (page.children) {
            findDependencies(page.children, depGraph, page.key);
          }
        }
      }
      function getDependencyGraph(nodes) {
        let pages = findNavigationEntries(nodes);
        let graph = new DepGraph();
        findDependencies(pages, graph);
        return graph;
      }
      function findBreadcrumbEntries(nodes, activeKey, options = {}) {
        let graph = getDependencyGraph(nodes);
        if (options.allowMissing && !graph.hasNode(activeKey)) {
          return [];
        }
        let deps = graph.dependenciesOf(activeKey);
        if (options.includeSelf) {
          deps.push(activeKey);
        }
        return activeKey ? deps.map((key) => {
          let data = Object.assign({}, graph.getNodeData(key));
          delete data.children;
          data._isBreadcrumb = true;
          return data;
        }) : [];
      }
      function getUrlFilter(eleventyConfig) {
        if (eleventyConfig.pathPrefix !== void 0) {
          return function(url) {
            return url;
          };
        }
        if ("getFilter" in eleventyConfig) {
          return eleventyConfig.getFilter("url");
        } else if ("nunjucksFilters" in eleventyConfig) {
          return eleventyConfig.nunjucksFilters.url;
        } else {
          throw new Error("Could not find a `url` filter for the eleventy-navigation plugin in eleventyNavigationToHtml filter.");
        }
      }
      function navigationToHtml(pages, options = {}) {
        options = Object.assign({
          listElement: "ul",
          listItemElement: "li",
          listClass: "",
          listItemClass: "",
          listItemHasChildrenClass: "",
          activeKey: "",
          activeListItemClass: "",
          anchorClass: "",
          activeAnchorClass: "",
          showExcerpt: false,
          isChildList: false
        }, options);
        let isChildList = !!options.isChildList;
        options.isChildList = true;
        let urlFilter = getUrlFilter(this);
        if (pages.length && pages[0].pluginType !== "eleventy-navigation") {
          throw new Error("Incorrect argument passed to eleventyNavigationToHtml filter. You must call `eleventyNavigation` or `eleventyNavigationBreadcrumb` first, like: `collection.all | eleventyNavigation | eleventyNavigationToHtml | safe`");
        }
        return pages.length ? `<${options.listElement}${!isChildList && options.listClass ? ` class="${options.listClass}"` : ""}>${pages.map((entry) => {
          let liClass = [];
          let aClass = [];
          if (options.listItemClass) {
            liClass.push(options.listItemClass);
          }
          if (options.anchorClass) {
            aClass.push(options.anchorClass);
          }
          if (options.activeKey === entry.key) {
            if (options.activeListItemClass) {
              liClass.push(options.activeListItemClass);
            }
            if (options.activeAnchorClass) {
              aClass.push(options.activeAnchorClass);
            }
          }
          if (options.listItemHasChildrenClass && entry.children && entry.children.length) {
            liClass.push(options.listItemHasChildrenClass);
          }
          return `<${options.listItemElement}${liClass.length ? ` class="${liClass.join(" ")}"` : ""}><a href="${urlFilter(entry.url)}"${aClass.length ? ` class="${aClass.join(" ")}"` : ""}>${entry.title}</a>${options.showExcerpt && entry.excerpt ? `: ${entry.excerpt}` : ""}${entry.children ? navigationToHtml.call(this, entry.children, options) : ""}</${options.listItemElement}>`;
        }).join("\n")}</${options.listElement}>` : "";
      }
      function navigationToMarkdown(pages, options = {}) {
        options = Object.assign({
          showExcerpt: false,
          childDepth: 0
        }, options);
        let childDepth = 1 + options.childDepth;
        options.childDepth++;
        let urlFilter = getUrlFilter(this);
        if (pages.length && pages[0].pluginType !== "eleventy-navigation") {
          throw new Error("Incorrect argument passed to eleventyNavigationToMarkdown filter. You must call `eleventyNavigation` or `eleventyNavigationBreadcrumb` first, like: `collection.all | eleventyNavigation | eleventyNavigationToMarkdown | safe`");
        }
        let indent = new Array(childDepth).join("  ") || "";
        return pages.length ? `${pages.map((entry) => {
          return `${indent}* [${entry.title}](${urlFilter(entry.url)})${options.showExcerpt && entry.excerpt ? `: ${entry.excerpt}` : ""}
${entry.children ? navigationToMarkdown.call(this, entry.children, options) : ""}`;
        }).join("")}` : "";
      }
      module.exports = {
        getDependencyGraph,
        findNavigationEntries,
        findBreadcrumbEntries,
        toHtml: navigationToHtml,
        toMarkdown: navigationToMarkdown
      };
    }
  });

  // node_modules/@11ty/eleventy-navigation/.eleventy.js
  var require_eleventy = __commonJS({
    "node_modules/@11ty/eleventy-navigation/.eleventy.js"(exports, module) {
      var pkg = require_package();
      var EleventyNavigation = require_eleventy_navigation();
      module.exports = function(eleventyConfig) {
        try {
          eleventyConfig.versionCheck(pkg["11ty"].compatibility);
        } catch (e) {
          console.log(`WARN: Eleventy Plugin (${pkg.name}) Compatibility: ${e.message}`);
        }
        eleventyConfig.addFilter("eleventyNavigation", EleventyNavigation.findNavigationEntries);
        eleventyConfig.addFilter("eleventyNavigationBreadcrumb", EleventyNavigation.findBreadcrumbEntries);
        eleventyConfig.addFilter("eleventyNavigationToHtml", function(pages, options) {
          return EleventyNavigation.toHtml.call(eleventyConfig, pages, options);
        });
        eleventyConfig.addFilter("eleventyNavigationToMarkdown", function(pages, options) {
          return EleventyNavigation.toMarkdown.call(eleventyConfig, pages, options);
        });
      };
      module.exports.navigation = {
        find: EleventyNavigation.findNavigationEntries,
        findBreadcrumbs: EleventyNavigation.findBreadcrumbEntries,
        getDependencyGraph: EleventyNavigation.getDependencyGraph
      };
    }
  });

  // src/assets/js/nav.js
  var { navigation } = require_eleventy();
  var bodyElement = document.querySelector("body");
  var navbarMenu = document.querySelector("#cs-navigation");
  var hamburgerMenu = document.querySelector("#cs-navigation .cs-hamburger");
  function toggleAriaExpanded(element) {
    const isExpanded = element.getAttribute("aria-expanded");
    element.setAttribute("aria-expanded", isExpanded === "false" ? "true" : "false");
  }
  function toggleMenu() {
    hamburgerMenu.classList.toggle("cs-active");
    navbarMenu.classList.toggle("cs-active");
    bodyElement.classList.toggle("cs-open");
    toggleAriaExpanded(hamburgerMenu);
  }
  hamburgerMenu.addEventListener("click", toggleMenu);
  navbarMenu.addEventListener("click", function(event) {
    if (event.target === navbarMenu && navbarMenu.classList.contains("cs-active")) {
      toggleMenu();
    }
  });
  function toggleDropdown(element) {
    element.classList.toggle("cs-active");
    const dropdownButton = element.querySelector(".cs-dropdown-button");
    if (dropdownButton) {
      toggleAriaExpanded(dropdownButton);
    }
  }
  var dropdownElements = document.querySelectorAll(".cs-dropdown");
  dropdownElements.forEach((element) => {
    let escapePressed = false;
    element.addEventListener("focusout", function(event) {
      if (escapePressed) {
        escapePressed = false;
        return;
      }
      if (!element.contains(event.relatedTarget)) {
        element.classList.remove("cs-active");
        const dropdownButton = element.querySelector(".cs-dropdown-button");
        if (dropdownButton) {
          toggleAriaExpanded(dropdownButton);
        }
      }
    });
    element.addEventListener("keydown", function(event) {
      if (element.classList.contains("cs-active")) {
        event.stopPropagation();
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleDropdown(element);
      }
      if (event.key === "Escape") {
        escapePressed = true;
        toggleDropdown(element);
      }
    });
    const maxWidthMediaQuery = window.matchMedia("(max-width: 63.9375rem)");
    if (maxWidthMediaQuery.matches) {
      element.addEventListener("click", () => toggleDropdown(element));
    }
  });
  var dropdownLinks = document.querySelectorAll(".cs-drop-li > .cs-li-link");
  dropdownLinks.forEach((link) => {
    link.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        window.location.href = this.href;
      }
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && hamburgerMenu.classList.contains("cs-active")) {
      toggleMenu();
    }
  });
})();
//# sourceMappingURL=nav.js.map
