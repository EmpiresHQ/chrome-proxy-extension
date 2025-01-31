import { useState, useEffect } from "react";
import '@pages/options/Options.css';

export default function OptionsPage() {
  const [secretKey, setSecretKey] = useState("");
  const [proxyUrl, setProxyUrl] = useState("");
  const [urls, setUrls] = useState<string[]>([""]);
  const [activeUrlIndex, setActiveUrlIndex] = useState<number | undefined>(0);
  const [isEnabled, setIsEnabled] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");

  type StorageData = {
    secretKey: string;
    proxyUrl: string;
    urls: string[];
    activeUrlIndex: number | undefined;
    isEnabled: boolean;
    activeUrl: string;
  }
  
  useEffect(() => {
    console.log('userEffect');
    chrome.storage.sync.get("extensionSettings", (data) => {
      if (data.extensionSettings) {
        const { secretKey, proxyUrl, urls, isEnabled, activeUrl } = data.extensionSettings as StorageData;
        const activeUrlIndex = urls.indexOf(activeUrl);
        setSecretKey(secretKey || "");
        setProxyUrl(proxyUrl || "");
        setUrls(urls || [""]);
        setActiveUrlIndex(activeUrlIndex);
        setIsEnabled(isEnabled);
      }
    });
  }, []);

  const toggleEnabled = () => {
    setIsEnabled(!isEnabled);
  };

  const addUrl = () => setUrls([...urls, ""]);

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const removeUrl = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
    
    if (activeUrlIndex === index) {
      setActiveUrlIndex(newUrls.length > 0 ? Math.max(0, index - 1) : undefined);
    } else if (activeUrlIndex !== undefined && activeUrlIndex > index) {
      setActiveUrlIndex(activeUrlIndex - 1);
    }
  };

  const setActiveUrl = (index: number) => {
    setActiveUrlIndex(index);
  };

  const saveChanges = () => {
    const data = { secretKey, proxyUrl, urls, activeUrlIndex, isEnabled };
    const activeUrl = urls[activeUrlIndex || 0];
    const newData: StorageData = { ...data, activeUrl };
    chrome.storage.sync.set({ extensionSettings: newData }, () => {
      setSaveMessage("Settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 2000);
    });
  };

  return (
    <div className="p-4 max-w-lg mx-auto border rounded-lg shadow-md bg-white">
      <button 
        onClick={toggleEnabled} 
        className={`w-full p-2 mb-2 rounded ${isEnabled ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}
      >
        {isEnabled ? "Enabled" : "Disabled"}
      </button>
      <input
        type="text"
        placeholder="Secret key input"
        value={secretKey}
        onChange={(e) => setSecretKey(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        placeholder="Chain proxy URL input"
        value={proxyUrl}
        onChange={(e) => setProxyUrl(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <div className="space-y-2">
        {urls.map((url, index) => (
          <div key={index} className="flex items-center space-x-2">
            <button 
              className={`p-2 rounded ${index === activeUrlIndex ? 'bg-green-500 text-white' : 'bg-gray-200'}`} 
              onClick={() => setActiveUrl(index)}
            >
              {index === activeUrlIndex ? "Used now" : "Use"}
            </button>
            <input
              type="text"
              value={url}
              onChange={(e) => updateUrl(index, e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="URL input"
            />
            <button 
              className="p-2 bg-red-500 text-white rounded" 
              onClick={() => removeUrl(index)}
            >
              ✖
            </button>
          </div>
        ))}
      </div>
      <button onClick={addUrl} className="w-full p-2 mt-2 bg-blue-200 rounded">
        Add another URL
      </button>
      <button onClick={saveChanges} className="w-full p-2 mt-4 bg-green-500 text-white rounded">
        Save changes
      </button>
      {saveMessage && <div className="mt-2 p-2 text-center text-green-600">{saveMessage}</div>}
    </div>
  );
}
