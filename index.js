const localStorageValues = { url: "url", sizes: "sizes" };

const defaultSizes = [
  { id: "large", width: 1920, height: 1080 },
  { id: "medium", width: 1280, height: 720 },
  { id: "iphoneSe", width: 375, height: 667 },
  { id: "iphoneXr", width: 414, height: 896 },
  { id: "samsungS8", width: 360, height: 740 },
];

const setSizes = (sizes) => {
  localStorage.setItem(localStorageValues.sizes, JSON.stringify(sizes));
};

const getSizes = () => {
  return JSON.parse(localStorage.getItem(localStorageValues.sizes));
};

const resetForm = () => {
  $("#name").val("");
  $("#height").val("");
  $("#width").val("");
};

const reset = () => {
  localStorage.removeItem(localStorageValues.sizes);
  localStorage.removeItem(localStorageValues.url);
  $("#url").val("");
  location.reload();
};

const renderScreenSizes = () => {
  const sizes = JSON.parse(localStorage.getItem(localStorageValues.sizes));
  const iframeContainer = $("#iframeContainer");
  const url = localStorage.getItem(localStorageValues.url);

  if (url) {
    iframeContainer.empty();
    for (const size of sizes) {
      const width = size.width / 3;
      const height = size.height / 3;

      const element = `
      <div class='wrap' style='width:${width}px; height:${height}px;'>
      <span class='device-text'>${size.id}: ${size.width} x ${size.height}</span>
        <iframe crossorigin="anonymous" class='frame' src='${url}' width=${size.width} height=${size.height} />
      </div>
    `;

      iframeContainer.append(element);
    }
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  const data = $("#controlForm :input").serializeArray();
  const url = data.find((input) => input.name === "url").value;
  const width = data.find((input) => input.name === "width").value;
  const height = data.find((input) => input.name === "height").value;
  const name = data.find((input) => input.name === "name").value;

  localStorage.setItem(localStorageValues.url, url);

  if (width && height && name) {
    const newScreen = { id: name.split(" ").join("-"), width, height };

    const existingSizes = getSizes();
    existingSizes.push(newScreen);
    setSizes(existingSizes);

    resetForm();
  } else if (width || height || name) {
    alert(
      "In order to create a new screen size you need to provide name, width and height"
    );
  }
  renderScreenSizes();
};

const showBrowserWarning = () => {
  if (
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
    navigator.brave
  ) {
    alert("For best results use Chrome or Firefox");
  }
};

addEventListener("load", () => {
  $("#reset-button").click(reset);
  $("#controlForm").submit(handleSubmit);

  const existingSizes = getSizes();
  if (!existingSizes) {
    setSizes(defaultSizes);
  }

  $("#url").val(localStorage.getItem(localStorageValues.url));
  renderScreenSizes();
  showBrowserWarning();
});
