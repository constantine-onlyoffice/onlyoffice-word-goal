(function (window, undefined) {
  window.Asc.plugin.init = function () {
    initLocalStorage();
    Run();
  };

  function initLocalStorage() {
    localStorage.setItem("plugin-word-count-goal-default", 500);
  }

  function updateCounter() {
    Asc.plugin.callCommand(
      () => {
        let wordStat = Api.GetDocument().GetStatistics().WordsCount;
        return wordStat;
      },
      false,
      false,
      (returnStat) => {
        let wordCount = localStorage.getItem("plugin-word-count-goal");
        let wordCountDef = localStorage.getItem("plugin-word-count-goal-default");

        if (!wordCount) {
          $(".inner-bar").width((Number(returnStat) * 100) / Number(wordCountDef) + "%");
          console.log((Number(returnStat) * 100) / Number(wordCountDef) + "%")
          document.getElementById("rate").textContent = `${returnStat}/${wordCountDef}`;
          if ((Number(returnStat) * 100) / Number(wordCountDef) > 99.99) {
            $(".post-bar").addClass("achieved");
          } else $(".post-bar").removeClass("achieved");
        } else {
          $(".inner-bar").width((Number(returnStat) * 100) / Number(wordCount) + "%");
          document.getElementById("rate").textContent = `${returnStat}/${wordCount}`;
          if ((Number(returnStat) * 100) / Number(wordCount) > 99.99) {
            $(".post-bar").addClass("achieved");
          } else $(".post-bar").removeClass("achieved");
        }
      },
    );
  }

  function Run() {
    updateCounter();
    let wordCount = localStorage.getItem("plugin-word-count-goal");
    let wordCountDef = localStorage.getItem("plugin-word-count-goal-default");
    let apply = document.querySelector("#apply");
    let count = document.querySelector("#count");

    $(document).ready(function () {
      count = document.querySelector("#count");
      wordCountValue = document.querySelector(".word-count-value");

      count.onchange = function () {
        wordCountValue.textContent = count.value;
      };

      let saved_count = localStorage.getItem("plugin-word-count-goal");
      if (saved_count) {
        $(count).val(saved_count);
        wordCountValue.textContent = saved_count;
      } else wordCountValue.textContent = wordCountDef;
    });

    apply.addEventListener("click", () => {
      if (count.checkValidity()) {
        localStorage.setItem("plugin-word-count-goal", count.value);
        $(".t-input-wrap").removeClass("is-error");
        $(".t-input").removeClass("is-error");
        updateCounter();
      } else {
        $(".t-input-wrap").addClass("is-error");
        $(".t-input").addClass("is-error");
        $(".t-input").removeClass("is-shaking");
        $(".t-input").addClass("is-shaking");

        let shakeMs = 80 * 2 + 60 * 2;
        window.setTimeout(function () {
          $(".t-input").removeClass("is-shaking");
        }, shakeMs + 20);
      }
    });

    window.Asc.plugin.attachEditorEvent("onChangeCurrentPage", () => {
      updateCounter();
    });
  }

  window.Asc.plugin.button = function (id) {
    this.executeCommand("close", "");
  };
})(window, undefined);
