// Send a message to the content script to show the popup
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const activeTab = tabs[0];

  // Send a message to the content script in the active tab
  chrome.tabs.sendMessage(activeTab.id, { type: "show_popup" });
});