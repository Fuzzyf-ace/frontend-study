import { REACT_ELEMENT } from "./react";
import { addEvent } from "./event";
function render(VirtualNode, containerDOM) {
  // 将虚拟dom转换成真实dom（挂载）
  // mount virtual dom to real dom
  mount(VirtualNode, containerDOM);
}

function mount(VirtualNode, containerDOM) {
  // 将虚拟dom转换成真实dom（挂载）
  // mount virtual dom to real dom
  // 1. create real dom
  const realDOM = createRealDOM(VirtualNode);
  // 2. mount real dom to container
  realDOM && containerDOM.appendChild(realDOM);
}

function createRealDOM(VirtualNode) {
  //type, props, and children are the properties we needed when use React.creatElement function
  // 1. create real dom
  const { type, props, ref } = VirtualNode;
  const children = props.children;
  let realDOM = null;
  //   console.log("VirtualNode.$$typeof", VirtualNode.$$typeof);
  //   console.log("REACT_ELEMENT", REACT_ELEMENT);
  //   console.log(VirtualNode.$$typeof === REACT_ELEMENT); //false
  if (type && VirtualNode.$$typeof === REACT_ELEMENT) {
    if (typeof type === "function") {
      // if input is a class component
      if (type.isReactComponent) {
        const instance = new type(props);
        const VirtualNode = instance.render();
        instance.oldVirtualNode = VirtualNode;
        return createRealDOM(VirtualNode);
      }
      // if input is a function component
      const VirtualNode = type(props);
      return createRealDOM(VirtualNode);
    } else {
      realDOM = document.createElement(VirtualNode.type);
    }
  }
  // 2. set children
  if (children) {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (typeof child === "string") {
          realDOM.appendChild(document.createTextNode(child));
        } else {
          mount(child, realDOM);
        }
      });
    } else if (typeof children === "string") {
      realDOM.appendChild(document.createTextNode(children));
    } else {
      mount(children, realDOM);
    }
  }
  // 3. set props
  if (props) {
    Object.keys(props).forEach((key) => {
      if (key !== "children") {
        if (key === "className") {
          // handle className
          realDOM.setAttribute("class", props[key]);
        } else if (key === "style") {
          // handle style
          const styleObj = props[key];
          Object.keys(styleObj).forEach((styleKey) => {
            realDOM.style[styleKey] = styleObj[styleKey];
          });
        } else if (/^on[A-Z].*/.test(key)) {
          // handle event: the simplest way
          // const eventName = key.slice(2).toLowerCase();
          // realDOM.addEventListener(eventName, props[key]);
          // handle event: with synthetic event
          addEvent(realDOM, key.toLowerCase(), props[key]);
        } else {
          // handle other props
          realDOM.setAttribute(key, props[key]);
        }
      }
    });
  }
  // 4. set dom property to VirtualNode, so that we can find the real dom for updating
  VirtualNode.dom = realDOM;
  // 5. set ref if it exists
  if (ref) {
    ref.current = realDOM;
  }
  return realDOM;
}

function findDOMByVirtualNode(VirtualNode) {
  return VirtualNode.dom;
}

const ReactDOM = {
  render,
  findDOMByVirtualNode,
  createRealDOM,
};

export default ReactDOM;
