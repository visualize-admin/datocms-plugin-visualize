import React, { useEffect, useState } from "react";
import { render } from "react-dom";

const BASE_URL = "http://localhost:3000";

const Plugin = ({ plugin }: { plugin: any }) => {
  const [id, setId] = useState(plugin.getFieldValue(plugin.fieldPath));
  useEffect(() => {
    return plugin.addFieldChangeListener(
      plugin.fieldPath,
      (newValue: string) => {
        setId(newValue);
      }
    );
  }, [plugin]);

  useEffect(() => {
    const listenToMessage = (e: any) => {
      if (e.origin === BASE_URL) {
        const matches = (e.data as string).match(/^CHART_ID\:(.+)$/);
        if (matches) {
          const [, chartId] = matches;
          console.log({ chartId });
          plugin.setFieldValue(plugin.fieldPath, chartId);
        }
      }
    };
    window.addEventListener("message", listenToMessage);
    return () => {
      window.removeEventListener("message", listenToMessage);
    };
  }, []);

  return (
    <>
      <div>
        <button
          className="DatoCMS-button DatoCMS-button--micro"
          onClick={() => {
            window.open(`${BASE_URL}/create/new`, `_blank`);
          }}
        >
          Create new chart
        </button>
        {id && (
          <button
            className="DatoCMS-button DatoCMS-button--micro"
            onClick={() => {
              window.open(`${BASE_URL}/create/new?from=${id}`, `_blank`);
            }}
          >
            Edit chart
          </button>
        )}
      </div>

      {id && (
        <iframe
          src={`${BASE_URL}/de/embed/${id}`}
          style={{ border: "none" }}
          name="visualize.admin.ch"
          scrolling="no"
          frameBorder="1"
          marginHeight={0}
          marginWidth={0}
          height="400px"
          width="400px"
        ></iframe>
      )}

      <IdInput
        value={id}
        onChange={(newval) => {
          plugin.setFieldValue(plugin.fieldPath, newval);
        }}
      />
    </>
  );
};

const IdInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
    ></input>
  );
};

(window as any).DatoCmsPlugin.init((plugin: any) => {
  plugin.startAutoResizer();

  const container = document.querySelector("#root");

  render(<Plugin plugin={plugin} />, container);
});
