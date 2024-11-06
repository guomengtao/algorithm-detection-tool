// 存储检测到的算法信息
let detectedAlgorithms = [];

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ALGORITHMS_DETECTED') {
    detectedAlgorithms = message.algorithms;
    // 通知popup更新显示
    chrome.runtime.sendMessage({
      type: 'UPDATE_ALGORITHMS',
      algorithms: detectedAlgorithms
    });
  }
  return true;
});

// 处理来自popup的请求
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_ALGORITHMS') {
    sendResponse({ algorithms: detectedAlgorithms });
  }
  return true;
}); 