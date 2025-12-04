import axios from "axios";

const API_BASE_URL = "http://localhost:5264/api/reports";

// Service for report generation and export
const reportService = {
  // Generate report for preview/view
  generateReport: async (reportRequest) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate`, reportRequest);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to generate report"
      );
    }
  },

  // Export report in specified format
  exportReport: async (reportRequest) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/export`, reportRequest, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to export report"
      );
    }
  },

  // Download file helper
  downloadFile: (blob, filename) => {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Get file extension based on format
  getFileExtension: (format) => {
    const extensions = {
      PDF: "pdf",
      Excel: "xlsx",
      CSV: "csv",
    };
    return extensions[format] || "txt";
  },

  // Get content type based on format
  getContentType: (format) => {
    const contentTypes = {
      PDF: "application/pdf",
      Excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      CSV: "text/csv",
    };
    return contentTypes[format] || "application/octet-stream";
  },
};

export default reportService;
