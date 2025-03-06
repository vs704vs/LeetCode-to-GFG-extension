// Function to create and inject the popup
async function injectPopup(url) {
  const apiUrl = `https://leetcode-to-gfg-server.onrender.com/findProblems?url=${encodeURIComponent(
    url
  )}`;
  let results = [];
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const response = await res.json();
    results = response.results;
    console.log(results);
  } catch (error) {
    console.log("Error fetching data:", error);
  }

  const popupContainer = document.createElement("div");
  const gfgLogoSrc = chrome.runtime.getURL("icons/gfg_logo.png");
  popupContainer.id = "leetcode-to-gfg-popup";
  popupContainer.innerHTML = `
          <div class="popup-content">
            <span class="close-btn">&times;</span>
            ${
              results.length > 0
                ? results
                    .map((result) => {
                      let difficultyColor;
                      if (result.difficulty.toLowerCase() === "easy") {
                        difficultyColor = "green";
                      } else if (result.difficulty.toLowerCase() === "medium") {
                        difficultyColor = "orange";
                      } else {
                        difficultyColor = "red";
                      }
                      return `
                <div class="container-header">
                  <a href="${result.url}" target="_blank" class="problem-title">${
                        result.name
                      }</a>
                </div>
                <div class="second-rung">
                  <img src="${gfgLogoSrc}" alt="GFG Logo" class="gfg-logo">
                  <p class="difficulty" style="color: ${difficultyColor};">${
                        result.difficulty
                      }</p>
                  <p class="accuracy">Accuracy: ${result.accuracy}</p>
                </div>
                <div class="company-tags-container">
                  ${result.companyTags
                    .map(
                      (company) => `<span class="company-tag">${company}</span>`
                    )
                    .join("")}
                </div>
                `;
                    })
                    .join("")
                : `<p class="accuracy">No data to display</p>`
            }
          </div>
        `;

  document.body.appendChild(popupContainer);

  const closeButton = popupContainer.querySelector(".close-btn");
  closeButton.addEventListener("click", () => {
    popupContainer.remove();
  });

  // // Set a timeout to remove the popup after 5 seconds
  // setTimeout(() => {
  //   popupContainer.remove();
  // }, 5000); // 5000 milliseconds = 5 seconds
}

// Check if the current URL matches a LeetCode problem page
if (
  window.location.href.includes("leetcode.com/problems/") &&
  window.location.href.includes("/description/")
) {
  const url = window.location.href;

  // Inject the popup into the page
  injectPopup(url);
}

// Listen for messages from the extension popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "show_popup") {
    const url = window.location.href;

    const existingPopup = document.getElementById("leetcode-to-gfg-popup");
    if (existingPopup) {
      existingPopup.remove();
    }

    injectPopup(url);
  }
});