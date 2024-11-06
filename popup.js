class AlgorithmUI {
  constructor() {
    this.algorithmList = document.getElementById('algorithm-list');
    this.algorithmDetail = document.getElementById('algorithm-detail');
    this.algorithmName = document.getElementById('algorithm-name');
    this.algorithmCode = document.getElementById('algorithm-code');
    this.algorithmDescription = document.getElementById('algorithm-description');
    this.optimizationSuggestions = document.getElementById('optimization-suggestions');
    
    this.initialize();
  }

  async initialize() {
    // 显示加载状态
    this.showLoading();
    
    // 获取当前检测到的算法
    const response = await this.getDetectedAlgorithms();
    if (response && response.algorithms) {
      this.renderAlgorithmList(response.algorithms);
    }

    // 监听算法更新消息
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'UPDATE_ALGORITHMS') {
        this.renderAlgorithmList(message.algorithms);
      }
    });

    // 添加返回按钮监听
    this.addBackButtonListener();
  }

  showLoading() {
    this.algorithmList.innerHTML = '<div class="loading">正在扫描页面中的算法...</div>';
  }

  addBackButtonListener() {
    const backButton = document.createElement('button');
    backButton.textContent = '返回列表';
    backButton.className = 'back-button hidden';
    this.algorithmDetail.insertBefore(backButton, this.algorithmDetail.firstChild);

    backButton.addEventListener('click', () => {
      this.algorithmDetail.classList.add('hidden');
      this.algorithmList.classList.remove('hidden');
      backButton.classList.add('hidden');
    });

    this.backButton = backButton;
  }

  async getDetectedAlgorithms() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { type: 'GET_ALGORITHMS' },
        (response) => resolve(response)
      );
    });
  }

  renderAlgorithmList(algorithms) {
    if (!algorithms || algorithms.length === 0) {
      this.algorithmList.innerHTML = `
        <div class="no-results">
          <p>未检测到算法</p>
          <small>提示：请确保页面已完全加载</small>
        </div>`;
      return;
    }

    // 按类型分组算法
    const groupedAlgorithms = this.groupAlgorithmsByType(algorithms);
    
    this.algorithmList.innerHTML = Object.entries(groupedAlgorithms)
      .map(([type, algos]) => `
        <div class="algorithm-group">
          <h3 class="group-title">${type}</h3>
          ${algos.map((algo, index) => `
            <div class="algorithm-item" data-index="${algo.originalIndex}">
              <h4>${algo.name}</h4>
              <p class="description">${algo.description.description || ''}</p>
              <span class="complexity">${algo.description.complexity || ''}</span>
            </div>
          `).join('')}
        </div>
      `).join('');

    // 添加点击事件监听器
    this.algorithmList.querySelectorAll('.algorithm-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        this.showAlgorithmDetail(algorithms[index]);
      });
    });
  }

  groupAlgorithmsByType(algorithms) {
    return algorithms.reduce((groups, algo, index) => {
      algo.originalIndex = index;
      if (!groups[algo.type]) {
        groups[algo.type] = [];
      }
      groups[algo.type].push(algo);
      return groups;
    }, {});
  }

  showAlgorithmDetail(algorithm) {
    this.algorithmName.textContent = `${algorithm.type}: ${algorithm.name}`;
    this.algorithmCode.textContent = algorithm.code;
    
    this.algorithmDescription.innerHTML = `
      <h3>算法说明</h3>
      <p>${algorithm.description.description || '暂无说明'}</p>
      <p class="complexity">复杂度：${algorithm.description.complexity || '未知'}</p>
    `;

    this.optimizationSuggestions.innerHTML = `
      <h3>优化建议</h3>
      <p>${algorithm.description.optimization || '暂无优化建议'}</p>
    `;

    this.algorithmList.classList.add('hidden');
    this.algorithmDetail.classList.remove('hidden');
    this.backButton.classList.remove('hidden');
  }
}

// 初始化UI
document.addEventListener('DOMContentLoaded', () => {
  new AlgorithmUI();
}); 