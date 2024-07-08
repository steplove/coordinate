// src/components/XmlDisplay.js
import React from "react";

const XmlDisplay = ({ data }) => {
  const renderXml = (data) => {
    return data.map((item, index) => (
      <div key={index} style={{ marginLeft: "20px" }}>
        <div>&lt;item&gt;</div>
        {Object.keys(item).map((key) => (
          <div key={key} style={{ marginLeft: "20px" }}>
            &lt;{key}&gt;{item[key]}&lt;/{key}&gt;
          </div>
        ))}
        <div>&lt;/item&gt;</div>
      </div>
    ));
  };

  return (
    <div style={{ fontFamily: "monospace", whiteSpace: "pre" }}>
      <div>&lt;root&gt;</div>
      {renderXml(data)}
      <div>&lt;/root&gt;</div>
    </div>
  );
};

export default XmlDisplay;
