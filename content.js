class AlgorithmDetector {
  constructor() {
    this.algorithms = [];
  }

  async analyze() {
    // 获取页面的所有脚本内容和代码块
    const scripts = Array.from(document.getElementsByTagName('script'));
    const codeBlocks = Array.from(document.querySelectorAll('pre, code, .code-area, .CodeMirror, [class*="code"]'));
    
    // 处理脚本标签
    for (const script of scripts) {
      if (script.src) {
        try {
          const response = await fetch(script.src);
          const code = await response.text();
          this.detectAlgorithms(code);
        } catch (error) {
          console.error('无法加载外部脚本:', error);
        }
      } else {
        this.detectAlgorithms(script.textContent);
      }
    }

    // 处理代码块
    for (const block of codeBlocks) {
      this.detectAlgorithms(block.textContent);
    }

    return this.algorithms;
  }

  detectAlgorithms(code) {
    // LeetCode常见算法类型检测
    this.detectArrayAlgorithms(code);
    this.detectStringAlgorithms(code);
    this.detectDynamicProgramming(code);
    this.detectTreeAlgorithms(code);
    this.detectGraphAlgorithms(code);
    this.detectSortingAlgorithms(code);
    this.detectSearchAlgorithms(code);
    this.detectDataStructures(code);
  }

  detectArrayAlgorithms(code) {
    const patterns = {
      twoPointers: {
        pattern: /(?:function|const|let|var)\s+\w+\s*\([^)]*\)\s*{[\s\S]*?(?:left|right|start|end)[\s\S]*?while\s*\([^)]*\)/i,
        name: '双指针算法'
      },
      slidingWindow: {
        pattern: /(?:function|const|let|var)\s+\w+\s*\([^)]*\)\s*{[\s\S]*?(?:window|slide|substr)[\s\S]*?(?:right|end)\+\+/i,
        name: '滑动窗口'
      },
      prefixSum: {
        pattern: /(?:prefix|preSum|dp)\s*\[\s*i\s*\]\s*=\s*(?:prefix|preSum|dp)\s*\[\s*i\s*-\s*1\s*\]\s*\+/i,
        name: '前缀和'
      }
    };
    this.detectByPatterns(code, '数组算法', patterns);
  }

  detectStringAlgorithms(code) {
    const patterns = {
      kmp: {
        pattern: /(?:function|const|let|var)\s+\w+\s*\([^)]*\)\s*{[\s\S]*?(?:next|lps|prefix)[\s\S]*?for[\s\S]*?}/i,
        name: 'KMP字符串匹配'
      },
      palindrome: {
        pattern: /(?:function|const|let|var)\s+\w+\s*\([^)]*\)\s*{[\s\S]*?(?:left|start)[\s\S]*?(?:right|end)[\s\S]*?while[\s\S]*?}/i,
        name: '回文串算法'
      }
    };
    this.detectByPatterns(code, '字符串算法', patterns);
  }

  detectDynamicProgramming(code) {
    const patterns = {
      dp: {
        pattern: /(?:let|var|const)\s+dp\s*=\s*(?:new\s+Array|Array\.from|Array\()[\s\S]*?for[\s\S]*?for[\s\S]*?}/i,
        name: '动态规划'
      },
      knapsack: {
        pattern: /(?:function|const|let|var)\s+\w+\s*\([^)]*\)\s*{[\s\S]*?(?:weight|value|dp)[\s\S]*?for[\s\S]*?for[\s\S]*?}/i,
        name: '背包问题'
      },
      lcs: {
        pattern: /(?:function|const|let|var)\s+\w+\s*\([^)]*\)\s*{[\s\S]*?(?:dp|length)[\s\S]*?text1[\s\S]*?text2[\s\S]*?}/i,
        name: '最长公共子序列'
      }
    };
    this.detectByPatterns(code, '动态规划', patterns);
  }

  detectTreeAlgorithms(code) {
    const patterns = {
      bstTraversal: {
        pattern: /(?:function|const|let|var)\s+\w+\s*\([^)]*\)\s*{[\s\S]*?(?:left|right)[\s\S]*?(?:recursion|stack|queue)[\s\S]*?}/i,
        name: '二叉树遍历'
      },
      balanceTree: {
        pattern: /(?:function|const|let|var)\s+\w+\s*\([^)]*\)\s*{[\s\S]*?(?:height|balance|rotate)[\s\S]*?}/i,
        name: '平衡树操作'
      }
    };
    this.detectByPatterns(code, '树算法', patterns);
  }

  detectSortingAlgorithms(code) {
    const patterns = {
      quickSort: {
        pattern: /(function\s+quickSort|quick_sort|QuickSort)\s*\([^)]*\)\s*{[\s\S]*?pivot[\s\S]*?}/i,
        name: '快速排序'
      },
      bubbleSort: {
        pattern: /(function\s+bubbleSort|bubble_sort|BubbleSort)\s*\([^)]*\)\s*{[\s\S]*?swap[\s\S]*?}/i,
        name: '冒泡排序'
      },
      mergeSort: {
        pattern: /(function\s+mergeSort|merge_sort|MergeSort)\s*\([^)]*\)\s*{[\s\S]*?merge[\s\S]*?}/i,
        name: '归并排序'
      },
      heapSort: {
        pattern: /(function\s+heapSort|heap_sort|HeapSort)\s*\([^)]*\)\s*{[\s\S]*?heap[\s\S]*?}/i,
        name: '堆排序'
      }
    };

    this.detectByPatterns(code, '排序算法', patterns);
  }

  detectSearchAlgorithms(code) {
    const patterns = {
      binarySearch: {
        pattern: /(function\s+binarySearch|binary_search|BinarySearch)\s*\([^)]*\)\s*{[\s\S]*?while[\s\S]*?}/i,
        name: '二分查找'
      },
      depthFirstSearch: {
        pattern: /(function\s+(?:dfs|depthFirstSearch|depth_first_search))\s*\([^)]*\)\s*{[\s\S]*?(?:visited|stack)[\s\S]*?}/i,
        name: '深度优先搜索'
      },
      breadthFirstSearch: {
        pattern: /(function\s+(?:bfs|breadthFirstSearch|breadth_first_search))\s*\([^)]*\)\s*{[\s\S]*?(?:queue|visited)[\s\S]*?}/i,
        name: '广度优先搜索'
      }
    };

    this.detectByPatterns(code, '搜索算法', patterns);
  }

  detectGraphAlgorithms(code) {
    const patterns = {
      floydWarshall: {
        pattern: /(function\s+(?:floydWarshall|floyd_warshall))\s*\([^)]*\)\s*{[\s\S]*?for[\s\S]*?for[\s\S]*?for[\s\S]*?}/i,
        name: 'Floyd-Warshall算法'
      },
      dijkstra: {
        pattern: /(function\s+(?:dijkstra|shortestPath))\s*\([^)]*\)\s*{[\s\S]*?(?:priority|distance|dist)[\s\S]*?}/i,
        name: 'Dijkstra最短路径'
      },
      bellmanFord: {
        pattern: /(function\s+(?:bellmanFord|bellman_ford))\s*\([^)]*\)\s*{[\s\S]*?for[\s\S]*?for[\s\S]*?}/i,
        name: 'Bellman-Ford算法'
      },
      kruskal: {
        pattern: /(function\s+(?:kruskal|minimumSpanningTree))\s*\([^)]*\)\s*{[\s\S]*?(?:union|find)[\s\S]*?}/i,
        name: 'Kruskal最小生成树'
      },
      prim: {
        pattern: /(function\s+(?:prim|minimumSpanningTree))\s*\([^)]*\)\s*{[\s\S]*?(?:priority|key)[\s\S]*?}/i,
        name: 'Prim最小生成树'
      }
    };

    this.detectByPatterns(code, '图算法', patterns);
  }

  detectDataStructures(code) {
    const patterns = {
      unionFind: {
        pattern: /(class\s+(?:UnionFind|DisjointSet)|function\s+(?:union|find))\s*[\({][^)]*[\)}][\s\S]*?(?:parent|rank)[\s\S]*?}/i,
        name: '并查集'
      },
      segmentTree: {
        pattern: /(class\s+(?:SegmentTree)|function\s+(?:build|update|query))\s*[\({][^)]*[\)}][\s\S]*?(?:left|right)[\s\S]*?}/i,
        name: '线段树'
      },
      fenwickTree: {
        pattern: /(class\s+(?:FenwickTree|BIT)|function\s+(?:update|query))\s*[\({][^)]*[\)}][\s\S]*?(?:sum|add)[\s\S]*?}/i,
        name: '树状数组'
      }
    };

    this.detectByPatterns(code, '数据结构', patterns);
  }

  detectCryptographyAlgorithms(code) {
    const patterns = {
      md5: {
        pattern: /function\s+simpleMD5\s*\([^)]*\)\s*{[\s\S]*?hash[\s\S]*?}/i,
        name: 'MD5加密'
      }
    };

    this.detectByPatterns(code, '加密算法', patterns);
  }

  detectByPatterns(code, type, patterns) {
    for (const [key, value] of Object.entries(patterns)) {
      if (value.pattern.test(code)) {
        const extractedCode = this.extractCode(code, value.pattern);
        if (extractedCode) {
          this.algorithms.push({
            type: type,
            name: value.name,
            code: extractedCode,
            description: this.getAlgorithmDescription(key)
          });
        }
      }
    }
  }

  extractCode(code, pattern) {
    const match = code.match(pattern);
    return match ? this.formatCode(match[0]) : '';
  }

  formatCode(code) {
    // 改进的代码格式化
    return code.trim()
      .replace(/\s+/g, ' ')
      .replace(/\{ /g, '{\n  ')
      .replace(/\} /g, '}\n')
      .replace(/; /g, ';\n  ')
      .replace(/\{(\S)/g, '{ $1')  // 在{后添加空格
      .replace(/(\S)\}/g, '$1 }'); // 在}前添加空格
  }

  getAlgorithmDescription(name) {
    const descriptions = {
      quickSort: {
        description: '一种高效的比较排序算法，使用分治策略',
        complexity: '平均时间复杂度：O(nlogn)',
        optimization: '可以通过三数取中法选择基准元素来优化'
      },
      binarySearch: {
        description: '在有序数组中查找特定元素的搜索算法',
        complexity: '时间复杂度：O(log n)',
        optimization: '可以使用插值查找来优化查找速度'
      },
      md5: {
        description: 'MD5消息摘要算法的简化实现',
        complexity: '时间复杂度：O(n)',
        optimization: '可以使用查表法优化计算速度'
      },
      depthFirstSearch: {
        description: '图的深度优先遍历算法',
        complexity: '时间复杂度：O(V + E)',
        optimization: '可以使用迭代方式代替递归来优化空间使用'
      },
      floydWarshall: {
        description: '用于寻找加权图中所有顶点对之间最短路径的算法',
        complexity: '时间复杂度：O(V³)',
        optimization: '可以通过矩阵优化来提高性能'
      },
      twoPointers: {
        description: '使用两个指针在数组或字符串上进行操作的算法',
        complexity: '时间复杂度：O(n)',
        optimization: '可以通过优化指针移动策略来提高效率'
      },
      slidingWindow: {
        description: '维护一个窗口在数组或字符串上滑动的算法',
        complexity: '时间复杂度：O(n)',
        optimization: '可以通过优化窗口大小的调整策略来提高效率'
      },
      dp: {
        description: '通过将问题分解为子问题来解决的算法',
        complexity: '时间复杂度：因问题而异',
        optimization: '可以通过空间压缩来优化内存使用'
      },
      kmp: {
        description: '高效的字符串匹配算法',
        complexity: '时间复杂度：O(m+n)',
        optimization: '可以通过优化next数组的构建来提高效率'
      }
    };
    return descriptions[name] || {
      description: '待补充',
      complexity: '待分析',
      optimization: '待补充'
    };
  }
}

// 向background script发送检测结果
new AlgorithmDetector().analyze().then(algorithms => {
  chrome.runtime.sendMessage({ type: 'ALGORITHMS_DETECTED', algorithms });
}); 