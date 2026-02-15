import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  Save, 
  Upload, 
  Image, 
  Type, 
  Settings, 
  Check,
  X,
  RefreshCw,
  ExternalLink
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BACKEND_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const CertificateSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    templateName: "",
    canvaDesignLink: "",
    backgroundImage: { public_id: "", url: "" },
    pageSize: "Landscape_A4",
    placeholders: [
      { fieldName: "studentName", x: 400, y: 300, fontSize: 36, fontFamily: "Helvetica", fontColor: "#2C3E50", isEnabled: true },
      { fieldName: "courseName", x: 400, y: 400, fontSize: 28, fontFamily: "Helvetica", fontColor: "#34495E", isEnabled: true },
      { fieldName: "teacherName", x: 400, y: 480, fontSize: 20, fontFamily: "Helvetica", fontColor: "#7F8C8D", isEnabled: true },
      { fieldName: "completionDate", x: 400, y: 540, fontSize: 18, fontFamily: "Helvetica", fontColor: "#95A5A6", isEnabled: true },
      { fieldName: "certificateId", x: 400, y: 600, fontSize: 14, fontFamily: "Courier", fontColor: "#BDC3C7", isEnabled: true }
    ],
    organizationName: "MDAI Learning Platform",
    certificateTitle: "Certificate of Completion",
    isEnabled: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/certificates/settings");
      if (response.data.settings) {
        setSettings(prev => ({
          ...prev,
          ...response.data.settings
        }));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put("/api/certificates/settings", settings);
      toast.success("Certificate settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handlePlaceholderChange = (index, field, value) => {
    const newPlaceholders = [...settings.placeholders];
    newPlaceholders[index] = { ...newPlaceholders[index], [field]: value };
    setSettings({ ...settings, placeholders: newPlaceholders });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // For now, use the file as a local preview URL (Blob URL)
    // In production, you would upload to Cloudinary via backend
    const previewUrl = URL.createObjectURL(file);
    
    setSettings({
      ...settings,
      backgroundImage: {
        public_id: `local/${file.name}`,
        url: previewUrl
      }
    });
    toast.success("Image selected! Click Save to persist.");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Certificate Template Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure the certificate template that will be used for all course completions.
        </p>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Certificate System</h2>
            <p className="text-sm text-gray-600">Enable or disable automatic certificate generation</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, isEnabled: !settings.isEnabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.isEnabled ? "bg-green-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.isEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Template Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Template Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template Name
            </label>
            <input
              type="text"
              value={settings.templateName}
              onChange={(e) => setSettings({ ...settings, templateName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Default Certificate Template"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Canva Design Link
            </label>
            <input
              type="url"
              value={settings.canvaDesignLink}
              onChange={(e) => setSettings({ ...settings, canvaDesignLink: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="https://canva.com/design/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>
            <input
              type="text"
              value={settings.organizationName}
              onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certificate Title
            </label>
            <input
              type="text"
              value={settings.certificateTitle}
              onChange={(e) => setSettings({ ...settings, certificateTitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page Size
            </label>
            <select
              value={settings.pageSize}
              onChange={(e) => setSettings({ ...settings, pageSize: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="Landscape_A4">Landscape A4</option>
              <option value="Landscape_Letter">Landscape Letter</option>
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
            </select>
          </div>
        </div>
      </div>

      {/* Background Image */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Background Image</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {settings.backgroundImage.url ? (
                <div className="relative">
                  <img 
                    src={settings.backgroundImage.url} 
                    alt="Certificate Background" 
                    className="max-h-64 mx-auto rounded"
                  />
                  <button
                    onClick={() => setSettings({ ...settings, backgroundImage: { public_id: "", url: "" } })}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="py-8">
                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Upload a certificate background image (PNG recommended)
                  </p>
                  <label className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
                    <Upload className="inline-block w-4 h-4 mr-2" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
              <li>Create your certificate design in Canva</li>
              <li>Export it as a high-quality PNG (recommended 2000x1500)</li>
              <li>Leave spaces for dynamic text fields (name, course, date, etc.)</li>
              <li>Upload the background image here</li>
              <li>Configure the placeholder positions below</li>
            </ol>
            {settings.canvaDesignLink && (
              <a
                href={settings.canvaDesignLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center text-blue-600 hover:underline"
              >
                Open Canva Design
                <ExternalLink className="ml-1 w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Placeholder Configuration */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Dynamic Field Positions</h2>
        <p className="text-sm text-gray-600 mb-4">
          Configure the position and style of dynamic fields that will be filled automatically.
        </p>
        
        <div className="space-y-4">
          {settings.placeholders.map((placeholder, index) => (
            <div key={placeholder.fieldName} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">
                    {placeholder.fieldName === "studentName" && "Student Name"}
                    {placeholder.fieldName === "courseName" && "Course Name"}
                    {placeholder.fieldName === "teacherName" && "Teacher Name"}
                    {placeholder.fieldName === "completionDate" && "Completion Date"}
                    {placeholder.fieldName === "certificateId" && "Certificate ID"}
                  </span>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={placeholder.isEnabled}
                    onChange={(e) => handlePlaceholderChange(index, "isEnabled", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">Show on certificate</span>
                </label>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">X Position</label>
                  <input
                    type="number"
                    value={placeholder.x}
                    onChange={(e) => handlePlaceholderChange(index, "x", parseInt(e.target.value))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    disabled={!placeholder.isEnabled}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Y Position</label>
                  <input
                    type="number"
                    value={placeholder.y}
                    onChange={(e) => handlePlaceholderChange(index, "y", parseInt(e.target.value))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    disabled={!placeholder.isEnabled}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Font Size</label>
                  <input
                    type="number"
                    value={placeholder.fontSize}
                    onChange={(e) => handlePlaceholderChange(index, "fontSize", parseInt(e.target.value))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    disabled={!placeholder.isEnabled}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Font Family</label>
                  <select
                    value={placeholder.fontFamily}
                    onChange={(e) => handlePlaceholderChange(index, "fontFamily", e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    disabled={!placeholder.isEnabled}
                  >
                    <option value="Helvetica">Helvetica</option>
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier">Courier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Color</label>
                  <input
                    type="color"
                    value={placeholder.fontColor}
                    onChange={(e) => handlePlaceholderChange(index, "fontColor", e.target.value)}
                    className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                    disabled={!placeholder.isEnabled}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button
          onClick={fetchSettings}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CertificateSettings;

