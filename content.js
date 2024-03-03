function handleAppearance(mutationsList, observer) {
  mutationsList.forEach((mutation) => {
    if (mutation.addedNodes) {
      mutation.addedNodes.forEach((node) => {
        if (
          node.classList !== undefined &&
          node.classList.contains("board-modal-container-container")
          && !isHidden(node)
        ) {
          console.log("Detected");
          // GameOverHadler();
          observer.disconnect();
        }
      });
    }
  });
}
function isHidden(el) {
  return (el.offsetParent === null)
}
function GameOverHadler() {
  const moves = parseMoveList(
    document.querySelector("wc-vertical-move-list").children
  );
  const players = document.getElementsByClassName("user-username-component");
  const opponentName = players[0].innerText;
  const userName = players[1].innerText;
  const ratings = document.getElementsByClassName("rating-score-rating");
  const opponentRating = parseInt(ratings[0].innerText);
  const userRating = parseInt(ratings[1].innerText);
  const isUserWhite = document
    .getElementsByClassName("clock-component")[0]
    .classList.contains("clock-black");
  const result = document.getElementsByClassName("game-result")[0].innerText;
  const payload = {
    user: {
      name: userName,
      rating: userRating,
    },
    opponent: {
      name: opponentName,
      rating: opponentRating,
    },
    isUserWhite: isUserWhite,
    result: result,
    moves: moves,
  };
  chrome.runtime.sendMessage({ type: "game_over", content: payload });
}

const observer = new MutationObserver(handleAppearance);
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes:true,
  characterData: true
})

/**
 * @param {HTMLCollection} gameMovesListChildren
 * @returns {{move: string, time: number}[]}
 */
function parseMoveList(gameMovesListChildren) {
  const moves = [];
  for (const node of gameMovesListChildren) {
    if (node.attributes["data-whole-move-number"] === undefined) {
      break;
    }
    const nodeChildren = node.children;
    for (let index = 0; index < nodeChildren.length; index += 2) {
      if (nodeChildren.length - 1 === index) {
        break;
      }
      const moveNode = nodeChildren[index];
      const moveChildNodes = moveNode.childNodes;
      let move = "";
      if (
        moveChildNodes.length > 1 &&
        moveChildNodes[0].attributes !== undefined
      ) {
        /** @type {HTMLSpanElement}*/
        const pieceSpan = moveChildNodes[0];
        /** @type {Text} */
        const pieceText = moveChildNodes[1];
        move =
          pieceSpan.attributes["data-figurine"].value + pieceText.textContent;
      } else {
        /** @type {Text} */
        const pawnText = moveChildNodes[0];
        move = pawnText.textContent;
      }
      const time = nodeChildren[index + 1].innerHTML;
      moves.push({
        move: move,
        time: parseFloat(time),
      });
    }
  }
  return moves;
}
