chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
  console.log('hit');
  if (message.type === "game_over") {
    const payload = message.content;
    console.log(payload);
    await fetch("http://localhost:5000/game", {
        method: "POST",
        body: JSON.stringify(payload)
    })
  }
});
