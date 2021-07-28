import React, { useEffect, useState } from "react";
import { render } from "react-dom";

const BASE_URL = "http://localhost:3000";

const Plugin = ({ plugin }: { plugin: any }) => {
  const [id, setId] = useState(plugin.getFieldValue(plugin.fieldPath));
  const [locale, setLocale] = useState(plugin.locale);
  useEffect(() => {
    return plugin.addFieldChangeListener(
      plugin.fieldPath,
      (newValue: string) => {
        setId(newValue);
      }
    );
  }, [plugin]);

  useEffect(() => {
    return plugin.addChangeListener("locale", (newValue: string) => {
      setLocale(newValue);
    });
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
      <div style={{ marginBottom: ".375rem" }}>
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
        <>
          <h5>Chart Preview</h5>
          <iframe
            src={`${BASE_URL}/${locale}/embed/${id}`}
            style={{
              border: "1px solid #f0f0f0",
              width: "100%",
              aspectRatio: "4 / 3",
            }}
            name="visualize.admin.ch"
            scrolling="no"
            frameBorder="1"
            marginHeight={0}
            marginWidth={0}
          ></iframe>
          <p>
            <a
              href={`${BASE_URL}/v/${id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open chart on visualize.admin.ch
            </a>
          </p>
        </>
      )}

      {/* <IdInput
        value={id}
        onChange={(newval) => {
          plugin.setFieldValue(plugin.fieldPath, newval);
        }}
      /> */}
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
