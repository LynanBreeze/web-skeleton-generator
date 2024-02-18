const convertRestArgsIntoStylesArr = ([...args]) => {
  return args.slice(1);
};

const getStyles = function () {
  const args = [...arguments];
  const [element] = args;

  let stylesProps =
    [...args][1] instanceof Array
      ? args[1]
      : convertRestArgsIntoStylesArr(args);

  const styles = window.getComputedStyle(element);
  const stylesObj = stylesProps.reduce((acc, v) => {
    acc[v] = styles.getPropertyValue(v);
    return acc;
  }, {});

  return stylesObj;
};

function getElementWidth(element) {
  const newElement = element.cloneNode(true);
  document.body.appendChild(newElement);
  newElement.style.width = "fit-content";
  const width = newElement.getBoundingClientRect().width;
  document.body.removeChild(newElement);
  return width;
}

function getElementHeight(element) {
  const newElement = element.cloneNode(true);
  document.body.appendChild(newElement);
  newElement.style.height = "fit-content";
  const height = newElement.getBoundingClientRect().height;
  setTimeout(() => {
    document.body.removeChild(newElement);
  }, 100);
  return height;
}

const generateSvg = async (ele, options) => {
  const { inScreenOnly = true } = options || {};
  const targetEle = document.body;
  const { width: eleWidth, height: eleHeight } =
    targetEle.getBoundingClientRect();
  const { innerWidth, innerHeight } = window;
  let canvasWidth = inScreenOnly ? innerWidth : eleWidth;
  const canvasHeight = inScreenOnly ? innerHeight : eleHeight;
  const fillColor = "rgba(227, 227, 227, 0.8)";

  let SvgNodeArr = [];
  SvgNodeArr.push(
    `<svg width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">`
  );

  let nodes = [];

  const forEachNode = async (element) => {
    let { x, y, width, height } = element.getBoundingClientRect();
    width = Math.min(
      width,
      element.clientWidth > 0 ? element.clientWidth : width
    );
    height = Math.min(
      height,
      element.clientHeight > 0 ? element.clientHeight : width
    );
    const styles = getStyles(element, [
      "border-radius",
      "background-color",
      "background-image",
      "display",
      "opacity",
      "visibility",
      "overflow-x",
      "overflow-y",
      "text-align",
      "padding-top",
      "padding-bottom",
      "padding-left",
      "padding-right",
      "line-height",
      "font-size",
      "border-color",
      ":before",
      ":after",
    ]);

    let elementBackgroundColor =
      styles["background-color"] &&
      !["rgba(0, 0, 0, 0)"].includes(styles["background-color"])
        ? styles["background-color"]
        : "";

    if (
      ["IMG", "VIDEO", "IFRAME"].includes(element.tagName) ||
      (element.children[0] &&
        ["IMG", "VIDEO", "IFRAME"].includes(element.children[0].tagName))
    ) {
      elementBackgroundColor = fillColor;
    }

    let borderRadiusValue = styles["border-radius"];
    // if (
    //   element.children.length === 1 &&
    //   getStyles(element.children[0], ["border-radius"])["border-radius"]
    // ) {
    //   borderRadiusValue = borderRadiusValue ==='0px'? getStyles(element.children[0], ["border-radius"])[
    //     "border-radius"
    //   ]: ''
    // }

    const parentStyles = getStyles(element.parentElement, [
      "border-radius",
      "overflow",
    ]);
    const grandParentStyles = element.parentElement.parentElement
      ? getStyles(element.parentElement.parentElement, [
          "border-radius",
          "overflow",
        ])
      : {};

    const parentElement = element.parentElement;
    const grandParentElement = element.parentElement.parentElement || null;

    if (
      parentElement &&
      width === parentElement.getBoundingClientRect().width &&
      height === parentElement.getBoundingClientRect().height &&
      parentStyles["overflow"] === "hidden" &&
      parentStyles["border-radius"]
    ) {
      borderRadiusValue = parentStyles["border-radius"];
    }

    if (
      grandParentElement &&
      width === grandParentElement.getBoundingClientRect().width &&
      height === grandParentElement.getBoundingClientRect().height &&
      grandParentStyles["overflow"] === "hidden" &&
      grandParentStyles["border-radius"]
    ) {
      borderRadiusValue = grandParentStyles["border-radius"];
    }

    if (!/%/.test(borderRadiusValue)) {
      if (/\s|^0px/.test(borderRadiusValue)) {
        borderRadiusValue = "";
      } else {
        borderRadiusValue = Number(borderRadiusValue.replace(/px/g, ""));
        if (!isNaN(borderRadiusValue) && borderRadiusValue >= height / 2) {
          borderRadiusValue = height / 2;
        }
      }
    }

    const isIconWrap =
      element.children.length === 1 && element.children[0].tagName === "svg";

    if (
      ["H1", "H2", "H3", "H4", "H5", "SPAN", "P", "DEL"].includes(
        element.tagName
      ) ||
      isIconWrap ||
      !element.children.length ||
      elementBackgroundColor
    ) {
      if (
        x >= 0 &&
        y >= 0 &&
        x <= canvasWidth &&
        y <= canvasHeight &&
        width > 0 &&
        height > 0
      ) {
        if (
          styles["display"] === "none" ||
          styles["opacity"] === "0" ||
          styles["visibility"] === "hidden" ||
          element.getAttribute("type") === "hidden" ||
          element.getAttribute("aria-hidden=") === "true" ||
          ["clearfix"].includes(element.className)
        ) {
          return;
        }
        if (
          (["H1", "H2", "H3", "H4", "H5", "P"].includes(element.tagName) &&
            /\S/.test(element.textContent)) ||
          (!element.children.length && /\S/.test(element.textContent)) ||
          (styles["display"] === "flex" && /\S/.test(element.textContent))
        ) {
          width = Math.min(getElementWidth(element) || width, width);
          if (styles["text-align"] === "center") {
            const parentElementWidth =
              element.parentElement.getBoundingClientRect().width;
            x = x + (parentElementWidth - width) / 2;
          }
        }

        if (
          ["H1", "H2", "H3", "H4", "H5", "P"].includes(
            element.parentElement.tagName
          ) &&
          /\S/.test(element.parentElement.textContent)
        ) {
          const parentWidth = getElementWidth(element);
          width = width > parentWidth ? parentWidth : width;
        }

        if (
          !element.children.length &&
          /\S/.test(element.textContent) &&
          styles["background-color"] === "rgba(0, 0, 0, 0)"
        ) {
          const lineHeight = Number(styles["font-size"].replace(/px/g, ""));
          if (lineHeight && !isNaN(lineHeight)) {
            if (height > lineHeight && height < lineHeight * 2) {
              y += (height - lineHeight) / 2;
              height = lineHeight;
            }
          }
        }

        if (
          !element.children.length &&
          /\S/.test(element.textContent) &&
          styles["background-color"] === "rgba(0, 0, 0, 0)"
        ) {
          const lineHeight = Number(styles["font-size"].replace(/px/g, ""));
          if (height > lineHeight) {
            if (styles["padding-top"] !== "0px") {
              const pdt = Number(styles["padding-top"].replace(/px/g, ""));
              y = y + pdt;
              height -= pdt;
            }
            if (styles["padding-bottom"] !== "0px") {
              const pdb = Number(styles["padding-bottom"].replace(/px/g, ""));
              height -= pdb;
            }
          }

          if (styles["padding-left"] !== "0px") {
            const pdl = Number(styles["padding-left"].replace(/px/g, ""));
            x += pdl;
            width -= pdl;
          }
          if (styles["padding-right"] !== "0px") {
            const pdr = Number(styles["padding-right"].replace(/px/g, ""));
            width -= pdr;
          }
        }

        let skip = false;

        if (
          element.tagName === "A" &&
          element.children.length === 1 &&
          !["IMG", "VIDEO", "IFRAME", "svg"].includes(
            element.children[0].tagName
          ) &&
          element.textContent === element.children[0].textContent
        ) {
          skip = true;
        }

        const hasPseudo =
          window
            .getComputedStyle(element, ":before")
            .getPropertyValue("content") !== "none";

        if (
          !["IMG", "VIDEO", "IFRAME", "svg", "INPUT"].includes(
            element.tagName
          ) &&
          !element.children.length &&
          !/\S/.test(element.textContent) &&
          !hasPseudo &&
          !isIconWrap &&
          styles["background-color"] === "rgba(0, 0, 0, 0)" &&
          styles["background-image"] === "none"
        ) {
          skip = true;
        }

        if (["FIGURE"].includes(element.tagName)) {
          skip = true;
        }

        if (
          element.tagName === "P" &&
          element.children.length === 1 &&
          element.innerHTML === element.children[0].outerHTML
        ) {
          skip = true;
        }

        !skip &&
          nodes.push({
            x,
            y,
            width,
            height,
            elementBackgroundColor,
            borderRadiusValue,
          });
      }
    }
    if (width > 0 && !!element.children.length && element.tagName !== "svg") {
      for (let i = 0; i < element.children.length; i++) {
        await forEachNode(element.children[i]);
      }
    }
    return true;
  };

  const addRects = () => {
    nodes.forEach((node) => {
      const { x, y, width, height, elementBackgroundColor, borderRadiusValue } =
        node;
      SvgNodeArr.push(
        `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${
          elementBackgroundColor || fillColor
        }" ${borderRadiusValue ? `rx="${borderRadiusValue}"` : ""}/>`
      );
    });
  };

  await forEachNode(targetEle);
  addRects();

  //   SvgNodeArr.push(`<defs>
  // <clipPath >
  // <rect width="${canvasWidth}" height="${canvasHeight}" fill="white"/>
  // </clipPath>
  // </defs>`);
  SvgNodeArr.push(`</svg>`);
  return SvgNodeArr.join("\n");
};

// generateSvg().then((res) => res);