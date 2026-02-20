import "../Styles/Inventory.css";
import { useState, useRef, useEffect } from "react";
import { 
  AlertTriangle, Plus, Search, Trash2, Package, Cake, Box, SprayCan, Wrench,
  TrendingUp, TrendingDown, Flame, Layers, Edit, Target, Heart, 
  Camera, Upload, CheckCircle, RefreshCw, Barcode,
  Calendar, Clock, X, Maximize2, Minimize2, Zap
} from "lucide-react";

const categories = [
  "Raw Ingredients",
  "Finished Products",
  "Packaging", 
  "Cleaning Supplies",
  "Equipment"
];

const categoryColors = {
  "Raw Ingredients": { primary: "#10b981", light: "#d1fae5" },
  "Finished Products": { primary: "#f59e0b", light: "#fef3c7" },
  "Packaging": { primary: "#3b82f6", light: "#dbeafe" },
  "Cleaning Supplies": { primary: "#06b6d4", light: "#cffafe" },
  "Equipment": { primary: "#8b5cf6", light: "#ede9fe" }
};

const categoryIcons = {
  "Raw Ingredients": Package,
  "Finished Products": Cake,
  "Packaging": Box,
  "Cleaning Supplies": SprayCan,
  "Equipment": Wrench
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState("Raw Ingredients");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  
  // Scanner states
  const [showScanner, setShowScanner] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(null);
  const [lastScanned, setLastScanned] = useState(null);
  const [scannedItems, setScannedItems] = useState([]);
  const [showScanHistory, setShowScanHistory] = useState(false);
  const [scannerFullscreen, setScannerFullscreen] = useState(false);
  const [scannerError, setScannerError] = useState(null);
  const [manualBarcode, setManualBarcode] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const [scannerInitialized, setScannerInitialized] = useState(false);

  const [items, setItems] = useState({
    "Raw Ingredients": [
      { id: 1, name: "All-purpose flour", stock: 20, unit: "kg", minStock: 10, price: 45, supplier: "Flour Mills Co.", barcode: "8901234567890", lastUpdated: "2024-02-20" },
      { id: 2, name: "Cake flour", stock: 15, unit: "kg", minStock: 8, price: 55, supplier: "Flour Mills Co.", barcode: "8901234567891", lastUpdated: "2024-02-20" },
      { id: 3, name: "White sugar", stock: 25, unit: "kg", minStock: 15, price: 40, supplier: "Sweet Supplies Inc.", barcode: "8901234567892", lastUpdated: "2024-02-19" },
      { id: 4, name: "Brown sugar", stock: 10, unit: "kg", minStock: 8, price: 45, supplier: "Sweet Supplies Inc.", barcode: "8901234567893", lastUpdated: "2024-02-19" },
      { id: 5, name: "Powdered sugar", stock: 8, unit: "kg", minStock: 5, price: 50, supplier: "Sweet Supplies Inc.", barcode: "8901234567894", lastUpdated: "2024-02-18" },
      { id: 6, name: "Unsalted butter", stock: 12, unit: "blocks", minStock: 8, price: 320, supplier: "Dairy Best", barcode: "8901234567895", lastUpdated: "2024-02-18" },
      { id: 7, name: "Salted butter", stock: 8, unit: "blocks", minStock: 5, price: 310, supplier: "Dairy Best", barcode: "8901234567896", lastUpdated: "2024-02-17" },
      { id: 8, name: "Eggs (large)", stock: 30, unit: "dozen", minStock: 15, price: 70, supplier: "Fresh Farms", barcode: "8901234567897", lastUpdated: "2024-02-20" },
      { id: 9, name: "Milk", stock: 15, unit: "liters", minStock: 10, price: 55, supplier: "Dairy Best", barcode: "8901234567898", lastUpdated: "2024-02-20" },
      { id: 10, name: "Heavy cream", stock: 8, unit: "liters", minStock: 5, price: 180, supplier: "Dairy Best", barcode: "8901234567899", lastUpdated: "2024-02-19" },
      { id: 11, name: "Baking powder", stock: 12, unit: "boxes", minStock: 6, price: 85, supplier: "BakeGoods", barcode: "8901234567900", lastUpdated: "2024-02-19" },
      { id: 12, name: "Baking soda", stock: 10, unit: "boxes", minStock: 5, price: 45, supplier: "BakeGoods", barcode: "8901234567901", lastUpdated: "2024-02-18" },
      { id: 13, name: "Vanilla extract", stock: 7, unit: "bottles", minStock: 4, price: 95, supplier: "Flavor House", barcode: "8901234567902", lastUpdated: "2024-02-18" },
      { id: 14, name: "Almond extract", stock: 5, unit: "bottles", minStock: 3, price: 110, supplier: "Flavor House", barcode: "8901234567903", lastUpdated: "2024-02-17" },
      { id: 15, name: "Cocoa powder", stock: 9, unit: "kg", minStock: 5, price: 280, supplier: "ChocoDelight", barcode: "8901234567904", lastUpdated: "2024-02-20" },
      { id: 16, name: "Salt", stock: 25, unit: "kg", minStock: 10, price: 20, supplier: "Spice World", barcode: "8901234567905", lastUpdated: "2024-02-20" },
      { id: 17, name: "Cinnamon", stock: 6, unit: "kg", minStock: 3, price: 150, supplier: "Spice World", barcode: "8901234567906", lastUpdated: "2024-02-19" },
      { id: 18, name: "Nutmeg", stock: 4, unit: "kg", minStock: 2, price: 220, supplier: "Spice World", barcode: "8901234567907", lastUpdated: "2024-02-19" },
      { id: 19, name: "Yeast", stock: 15, unit: "packs", minStock: 8, price: 35, supplier: "BakeGoods", barcode: "8901234567908", lastUpdated: "2024-02-18" },
      { id: 20, name: "Vegetable oil", stock: 18, unit: "liters", minStock: 10, price: 110, supplier: "Oil Co.", barcode: "8901234567909", lastUpdated: "2024-02-18" },
    ],
    "Finished Products": [
      { id: 21, name: "Chocolate cake", stock: 5, unit: "pcs", minStock: 3, price: 450, barcode: "FIN001", lastUpdated: "2024-02-20" },
      { id: 22, name: "Vanilla cake", stock: 8, unit: "pcs", minStock: 4, price: 420, barcode: "FIN002", lastUpdated: "2024-02-20" },
      { id: 23, name: "Red velvet cake", stock: 3, unit: "pcs", minStock: 2, price: 480, barcode: "FIN003", lastUpdated: "2024-02-19" },
      { id: 24, name: "Black forest cake", stock: 4, unit: "pcs", minStock: 2, price: 520, barcode: "FIN004", lastUpdated: "2024-02-19" },
      { id: 25, name: "Cheesecake", stock: 3, unit: "pcs", minStock: 2, price: 550, barcode: "FIN005", lastUpdated: "2024-02-18" },
      { id: 26, name: "Cupcakes (dozen)", stock: 6, unit: "boxes", minStock: 4, price: 360, barcode: "FIN006", lastUpdated: "2024-02-20" },
      { id: 27, name: "Brownies (dozen)", stock: 5, unit: "boxes", minStock: 3, price: 300, barcode: "FIN007", lastUpdated: "2024-02-20" },
      { id: 28, name: "Cookies (dozen)", stock: 7, unit: "boxes", minStock: 4, price: 240, barcode: "FIN008", lastUpdated: "2024-02-19" },
      { id: 29, name: "Macarons (dozen)", stock: 4, unit: "boxes", minStock: 2, price: 480, barcode: "FIN009", lastUpdated: "2024-02-19" },
      { id: 30, name: "Croissants", stock: 12, unit: "pcs", minStock: 6, price: 60, barcode: "FIN010", lastUpdated: "2024-02-18" },
    ],
    "Packaging": [
      { id: 31, name: "Cake boxes (1/2 kg)", stock: 45, unit: "pcs", minStock: 20, price: 25, supplier: "PackPlus", barcode: "PKG001", lastUpdated: "2024-02-20" },
      { id: 32, name: "Cake boxes (1 kg)", stock: 38, unit: "pcs", minStock: 15, price: 30, supplier: "PackPlus", barcode: "PKG002", lastUpdated: "2024-02-20" },
      { id: 33, name: "Cake boxes (2 kg)", stock: 25, unit: "pcs", minStock: 10, price: 40, supplier: "PackPlus", barcode: "PKG003", lastUpdated: "2024-02-19" },
      { id: 34, name: "Cupcake boxes", stock: 30, unit: "pcs", minStock: 15, price: 35, supplier: "PackPlus", barcode: "PKG004", lastUpdated: "2024-02-20" },
      { id: 35, name: "Cookie boxes", stock: 40, unit: "pcs", minStock: 20, price: 28, supplier: "PackPlus", barcode: "PKG005", lastUpdated: "2024-02-19" },
    ],
    "Cleaning Supplies": [
      { id: 36, name: "Dish soap", stock: 12, unit: "bottles", minStock: 6, price: 85, supplier: "CleanCo", barcode: "CLN001", lastUpdated: "2024-02-19" },
      { id: 37, name: "All-purpose cleaner", stock: 10, unit: "bottles", minStock: 5, price: 120, supplier: "CleanCo", barcode: "CLN002", lastUpdated: "2024-02-19" },
      { id: 38, name: "Glass cleaner", stock: 8, unit: "bottles", minStock: 4, price: 95, supplier: "CleanCo", barcode: "CLN003", lastUpdated: "2024-02-18" },
      { id: 39, name: "Disinfectant wipes", stock: 15, unit: "containers", minStock: 8, price: 150, supplier: "CleanCo", barcode: "CLN004", lastUpdated: "2024-02-18" },
      { id: 40, name: "Paper towels", stock: 25, unit: "rolls", minStock: 12, price: 45, supplier: "CleanCo", barcode: "CLN005", lastUpdated: "2024-02-20" },
    ],
    "Equipment": [
      { id: 41, name: "Mixing bowls (set)", stock: 8, unit: "sets", minStock: 4, price: 450, supplier: "KitchenPro", barcode: "EQP001", lastUpdated: "2024-02-18" },
      { id: 42, name: "Measuring cups", stock: 10, unit: "sets", minStock: 5, price: 120, supplier: "KitchenPro", barcode: "EQP002", lastUpdated: "2024-02-18" },
      { id: 43, name: "Measuring spoons", stock: 12, unit: "sets", minStock: 6, price: 80, supplier: "KitchenPro", barcode: "EQP003", lastUpdated: "2024-02-17" },
      { id: 44, name: "Whisks", stock: 15, unit: "pcs", minStock: 8, price: 90, supplier: "KitchenPro", barcode: "EQP004", lastUpdated: "2024-02-17" },
      { id: 45, name: "Spatulas", stock: 18, unit: "pcs", minStock: 9, price: 70, supplier: "KitchenPro", barcode: "EQP005", lastUpdated: "2024-02-20" },
    ],
  });

  // Load QuaggaJS dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/quagga/dist/quagga.min.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
      if (window.Quagga) {
        window.Quagga.stop();
      }
    };
  }, []);

  // Initialize scanner
  const initializeScanner = async () => {
    setScannerError(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          setScannerInitialized(true);
          startScanning();
        };
      }
    } catch (error) {
      setScannerError("Camera access denied. Please allow camera access to scan.");
      console.error("Camera error:", error);
    }
  };

  // Start scanning for barcodes
  const startScanning = () => {
    if (!window.Quagga) {
      setTimeout(startScanning, 500);
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;

    const context = canvas.getContext('2d');
    
    // Capture and process frames
    scanIntervalRef.current = setInterval(() => {
      if (!video.videoWidth) return;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Use Quagga to decode barcode
      window.Quagga.decodeSingle({
        src: canvas.toDataURL(),
        numOfWorkers: 0,
        inputStream: {
          size: 800
        },
        decoder: {
          readers: ["ean_reader", "ean_8_reader", "code_128_reader", "code_39_reader", "upc_reader"]
        }
      }, (result) => {
        if (result && result.codeResult) {
          const barcode = result.codeResult.code;
          handleScannedBarcode(barcode);
        }
      });
    }, 500);
  };

  // Handle scanned barcode
  const handleScannedBarcode = (barcode) => {
    // Search for item across all categories
    let foundItem = null;
    let foundCategory = null;
    
    Object.entries(items).forEach(([category, categoryItems]) => {
      const item = categoryItems.find(i => i.barcode === barcode);
      if (item) {
        foundItem = item;
        foundCategory = category;
      }
    });

    if (foundItem) {
      // Update stock
      const updated = { ...items };
      const itemIndex = updated[foundCategory].findIndex(i => i.id === foundItem.id);
      
      if (itemIndex !== -1) {
        updated[foundCategory][itemIndex].stock += 1; // Add 1 unit
        updated[foundCategory][itemIndex].lastUpdated = new Date().toISOString().split('T')[0];
        
        setItems(updated);
        
        // Add to scan history
        const newScannedItem = {
          id: foundItem.id,
          name: foundItem.name,
          scannedQty: 1,
          unit: foundItem.unit,
          barcode: barcode,
          timestamp: new Date().toLocaleTimeString()
        };
        
        setScannedItems(prev => [newScannedItem, ...prev].slice(0, 10));
        setLastScanned(new Date().toLocaleString());
        setScanSuccess(`Scanned: ${foundItem.name} (+1 ${foundItem.unit})`);
        
        // Clear success message after 3 seconds
        setTimeout(() => setScanSuccess(null), 3000);
        
        // Vibrate if supported (mobile)
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }
      }
    } else {
      setScanSuccess(`Unknown barcode: ${barcode}`);
      setTimeout(() => setScanSuccess(null), 3000);
    }
  };

  // Manual barcode entry
  const handleManualBarcode = () => {
    if (!manualBarcode) return;
    handleScannedBarcode(manualBarcode);
    setManualBarcode("");
    setShowManualEntry(false);
  };

  // Open scanner
  const openScanner = () => {
    setShowScanner(true);
    initializeScanner();
  };

  // Close scanner
  const closeScanner = () => {
    setShowScanner(false);
    setScannerFullscreen(false);
    setScannerInitialized(false);
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setScannerFullscreen(!scannerFullscreen);
  };

  const addItem = () => {
    if (!itemName.trim() || !quantity) return;
    
    const updated = { ...items };
    updated[activeCategory].push({
      id: Date.now(),
      name: itemName.trim(),
      stock: Number(quantity),
      unit: "pcs",
      minStock: 5,
      price: 0,
      supplier: "Manual Entry",
      barcode: `MAN${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    setItems(updated);
    setItemName("");
    setQuantity("");
  };

  const deleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updated = { ...items };
      updated[activeCategory] = updated[activeCategory].filter(
        (item) => item.id !== id
      );
      setItems(updated);
    }
  };

  const updateStock = (id, newStock) => {
    if (newStock < 0) return;
    const updated = { ...items };
    const item = updated[activeCategory].find(item => item.id === id);
    if (item) {
      item.stock = Number(newStock);
      item.lastUpdated = new Date().toISOString().split('T')[0];
    }
    setItems(updated);
    setEditingId(null);
  };

  const filteredItems = items[activeCategory].filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = items[activeCategory].length;
  const totalStock = items[activeCategory].reduce((acc, item) => acc + item.stock, 0);
  const lowStockInCategory = items[activeCategory].filter(item => item.stock < (item.minStock || 10)).length;
  const categoryHealth = totalItems ? Math.round((totalItems - lowStockInCategory) / totalItems * 100) : 0;
  
  const lowStockCount = Object.values(items)
    .flat()
    .filter((item) => item.stock < (item.minStock || 10)).length;

  const criticalStockCount = Object.values(items)
    .flat()
    .filter((item) => item.stock < (item.minStock || 10) / 2).length;

  const totalValue = Object.values(items)
    .flat()
    .reduce((acc, item) => acc + (item.stock * (item.price || 0)), 0);

  const getStockStatus = (stock, minStock = 10) => {
    if (stock < minStock / 2) return { 
      label: 'Critical',
      color: '#fee2e2',
      textColor: '#b91c1c',
      border: '#fecaca',
      icon: Flame
    };
    if (stock < minStock) return { 
      label: 'Low',
      color: '#ffedd5',
      textColor: '#9a3412',
      border: '#fed7aa',
      icon: TrendingDown
    };
    if (stock < minStock * 1.5) return { 
      label: 'Medium',
      color: '#fef9c3',
      textColor: '#854d0e',
      border: '#fef08a',
      icon: Target
    };
    return { 
      label: 'Good',
      color: '#dcfce7',
      textColor: '#166534',
      border: '#bbf7d0',
      icon: TrendingUp
    };
  };

  const IconComponent = categoryIcons[activeCategory] || Package;

  return (
    <div className="app">
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo-wrapper" style={{ background: `linear-gradient(135deg, ${categoryColors[activeCategory]?.primary || '#8b5cf6'}, #c084fc)` }}>
              <Package className="logo-icon" />
            </div>
            <div>
              <h1 className="logo-text">Inventory Management</h1>
              <p className="logo-subtext">Track and manage your stock efficiently</p>
            </div>
          </div>
          
          <div className="header-stats">
            <div className="stat-badge stat-critical">
              <Flame className="stat-icon" />
              <span>{criticalStockCount} Critical</span>
            </div>
            <div className="stat-badge stat-low">
              <AlertTriangle className="stat-icon" />
              <span>{lowStockCount} Low Stock</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-total">
              <p className="stat-total-value">₹{totalValue.toLocaleString()}</p>
              <p className="stat-total-label">Inventory Value</p>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="tabs-container">
          <nav className="tabs-nav">
            {categories.map((category) => {
              const Icon = categoryIcons[category];
              const isActive = activeCategory === category;
              const color = categoryColors[category]?.primary || '#8b5cf6';
              
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`tab-btn ${isActive ? 'active' : ''}`}
                  style={isActive ? { borderBottomColor: color, color: color } : {}}
                >
                  <Icon className="tab-icon" style={isActive ? { color: color } : {}} />
                  <span>{category}</span>
                  <span className="tab-count" style={isActive ? { background: categoryColors[category]?.light, color: color } : {}}>
                    {items[category].length}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Scanner Section */}
        <div className="scanner-section">
          <div className="scanner-header">
            <div className="scanner-title">
              <Zap className="scanner-title-icon" />
              <h2>Barcode Scanner</h2>
            </div>
            <div className="scanner-actions">
              <button 
                className="scanner-btn scan-btn"
                onClick={openScanner}
              >
                <Camera />
                <span>Open Scanner</span>
              </button>
              <button 
                className="scanner-btn upload-btn"
                onClick={() => setShowManualEntry(true)}
              >
                <Barcode />
                <span>Enter Barcode</span>
              </button>
              <button 
                className="scanner-btn history-btn"
                onClick={() => setShowScanHistory(!showScanHistory)}
              >
                <Clock />
                <span>History</span>
              </button>
            </div>
          </div>

          {/* Manual Barcode Entry */}
          {showManualEntry && (
            <div className="manual-barcode">
              <input
                type="text"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="Enter barcode number"
                className="barcode-input"
                onKeyPress={(e) => e.key === 'Enter' && handleManualBarcode()}
                autoFocus
              />
              <button onClick={handleManualBarcode} className="barcode-submit">
                <CheckCircle />
              </button>
              <button onClick={() => setShowManualEntry(false)} className="barcode-cancel">
                <X />
              </button>
            </div>
          )}

          {/* Scan Success Message */}
          {scanSuccess && (
            <div className="scan-success">
              <CheckCircle className="success-icon" />
              <span>{scanSuccess}</span>
            </div>
          )}

          {lastScanned && (
            <div className="last-scanned">
              <Calendar className="scanned-icon" />
              <span>Last scan: {lastScanned}</span>
            </div>
          )}

          {showScanHistory && scannedItems.length > 0 && (
            <div className="scan-history">
              <div className="history-header">
                <h3>Recent Scans</h3>
                <button onClick={() => setShowScanHistory(false)}>✕</button>
              </div>
              <div className="history-list">
                {scannedItems.map((item, index) => (
                  <div key={index} className="history-item">
                    <div className="history-item-info">
                      <span className="history-item-name">{item.name}</span>
                      <span className="history-item-barcode">{item.barcode}</span>
                      <span className="history-item-time">{item.timestamp}</span>
                    </div>
                    <span className="history-item-qty">+{item.scannedQty} {item.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Scanner Modal */}
        {showScanner && (
          <div className={`scanner-modal ${scannerFullscreen ? 'fullscreen' : ''}`}>
            <div className="scanner-modal-header">
              <h3>Scan Barcode</h3>
              <div className="scanner-modal-actions">
                <button onClick={toggleFullscreen} className="scanner-modal-btn">
                  {scannerFullscreen ? <Minimize2 /> : <Maximize2 />}
                </button>
                <button onClick={closeScanner} className="scanner-modal-btn close">
                  <X />
                </button>
              </div>
            </div>
            
            <div className="scanner-container">
              <video
                ref={videoRef}
                className="scanner-video"
                playsInline
              />
              <canvas
                ref={canvasRef}
                className="scanner-canvas"
                style={{ display: 'none' }}
              />
              
              {!scannerInitialized && !scannerError && (
                <div className="scanner-loading">
                  <RefreshCw className="spinning" />
                  <p>Initializing camera...</p>
                </div>
              )}
              
              {scannerError && (
                <div className="scanner-error">
                  <AlertTriangle />
                  <p>{scannerError}</p>
                  <button onClick={initializeScanner} className="retry-btn">
                    Try Again
                  </button>
                </div>
              )}
              
              <div className="scanner-overlay">
                <div className="scan-area">
                  <div className="scan-line"></div>
                </div>
                <p className="scan-instruction">
                  Position barcode within the frame
                </p>
              </div>
            </div>
          </div>
        )}

        {criticalStockCount > 0 && (
          <div className="alert-banner">
            <div className="alert-content" style={{ background: `linear-gradient(135deg, #ef4444, #f97316)` }}>
              <div className="alert-icon-wrapper">
                <AlertTriangle className="alert-icon" />
              </div>
              <div className="alert-text">
                <span className="alert-highlight">{criticalStockCount} items</span> have critically low stock! Need immediate attention.
              </div>
              <button className="alert-button">View All</button>
            </div>
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper" style={{ background: categoryColors[activeCategory]?.light }}>
                <IconComponent className="stat-card-icon" style={{ color: categoryColors[activeCategory]?.primary }} />
              </div>
              <span className="stat-card-value">{totalItems}</span>
            </div>
            <p className="stat-card-label">Items in {activeCategory}</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper" style={{ background: '#d1fae5' }}>
                <TrendingUp className="stat-card-icon" style={{ color: '#10b981' }} />
              </div>
              <span className="stat-card-value">{totalStock}</span>
            </div>
            <p className="stat-card-label">Total Stock Units</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper" style={{ background: '#fef3c7' }}>
                <Target className="stat-card-icon" style={{ color: '#f59e0b' }} />
              </div>
              <span className="stat-card-value">{lowStockInCategory}</span>
            </div>
            <p className="stat-card-label">Low Stock Items</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper" style={{ background: '#ede9fe' }}>
                <Heart className="stat-card-icon" style={{ color: '#8b5cf6' }} />
              </div>
              <span className="stat-card-value">{categoryHealth}%</span>
            </div>
            <p className="stat-card-label">Category Health</p>
          </div>
        </div>

        <div className="form-card">
          <h2 className="form-title">Add New Item</h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Item Name</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Enter item name"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                min="0"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="form-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group form-button-group">
              <button
                onClick={addItem}
                disabled={!itemName.trim() || !quantity}
                className="form-button"
                style={{ background: `linear-gradient(135deg, ${categoryColors[activeCategory]?.primary || '#8b5cf6'}, #c084fc)` }}
              >
                <Plus className="button-icon" />
                <span>Add Item</span>
              </button>
            </div>
          </div>
        </div>

        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items..."
            className="search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="search-clear">
              ✕
            </button>
          )}
        </div>

        <div className="table-container">
          <div className="table-header">
            <div className="table-row">
              <div className="table-cell col-4">Item Name</div>
              <div className="table-cell col-2">Barcode</div>
              <div className="table-cell col-2">Stock</div>
              <div className="table-cell col-2">Min Stock</div>
              <div className="table-cell col-1">Status</div>
              <div className="table-cell col-1 text-right">Actions</div>
            </div>
          </div>

          <div className="table-body">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const status = getStockStatus(item.stock, item.minStock);
                const StatusIcon = status.icon;
                
                return (
                  <div key={item.id} className="table-row table-row-hover">
                    <div className="table-cell col-4">
                      <div className="item-info">
                        <div className="item-dot" style={{ background: categoryColors[activeCategory]?.primary }}></div>
                        <div>
                          <p className="item-name">{item.name}</p>
                          <p className="item-id">{item.supplier || 'No supplier'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="table-cell col-2">
                      <span className="item-barcode">{item.barcode}</span>
                    </div>
                    
                    <div className="table-cell col-2">
                      {editingId === item.id ? (
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => updateStock(item.id, editValue)}
                          onKeyPress={(e) => e.key === 'Enter' && updateStock(item.id, editValue)}
                          className="stock-input"
                          autoFocus
                          min="0"
                        />
                      ) : (
                        <div className="stock-display">
                          <span className="stock-value">{item.stock}</span>
                          <span className="stock-unit">{item.unit}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="table-cell col-2">
                      <span className="min-stock">{item.minStock || 10} {item.unit}</span>
                    </div>
                    
                    <div className="table-cell col-1">
                      <span className="status-badge" style={{ background: status.color, color: status.textColor, borderColor: status.border }}>
                        <StatusIcon className="status-icon" />
                        <span>{status.label}</span>
                      </span>
                    </div>
                    
                    <div className="table-cell col-1 actions">
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditValue(item.stock);
                        }}
                        className="action-btn edit-btn"
                        title="Edit stock"
                      >
                        <Edit className="action-icon" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="action-btn delete-btn"
                        title="Delete item"
                      >
                        <Trash2 className="action-icon" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <div className="empty-icon-wrapper">
                  <Package className="empty-icon" />
                </div>
                <p className="empty-title">No items found</p>
                <p className="empty-text">
                  {searchTerm ? 'Try adjusting your search' : 'Add your first item using the form above'}
                </p>
              </div>
            )}
          </div>

          {filteredItems.length > 0 && (
            <div className="table-footer">
              <div className="footer-left">
                Showing <strong>{filteredItems.length}</strong> of <strong>{totalItems}</strong> items
              </div>
              <div className="footer-right">
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#22c55e' }}></span>
                  <span>Good</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#eab308' }}></span>
                  <span>Medium</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#f97316' }}></span>
                  <span>Low</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#ef4444' }}></span>
                  <span>Critical</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .scanner-section {
          background: white;
          border-radius: 16px;
          border: 1px solid var(--lavender-200);
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.08);
        }

        .scanner-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .scanner-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .scanner-title-icon {
          width: 24px;
          height: 24px;
          color: var(--primary);
        }

        .scanner-title h2 {
          font-size: 18px;
          font-weight: 600;
          color: var(--gray-800);
          margin: 0;
        }

        .scanner-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .scanner-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: none;
          border-radius: 40px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .scanner-btn svg {
          width: 18px;
          height: 18px;
        }

        .scan-btn {
          background: linear-gradient(135deg, var(--primary), var(--lavender-400));
          color: white;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .scan-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(139, 92, 246, 0.4);
        }

        .upload-btn {
          background: var(--lavender-100);
          color: var(--primary-dark);
        }

        .upload-btn:hover {
          background: var(--lavender-200);
          transform: translateY(-2px);
        }

        .history-btn {
          background: var(--gray-100);
          color: var(--gray-700);
        }

        .history-btn:hover {
          background: var(--gray-200);
          transform: translateY(-2px);
        }

        .manual-barcode {
          margin-top: 16px;
          display: flex;
          gap: 8px;
          animation: slideDown 0.3s ease;
        }

        .barcode-input {
          flex: 1;
          padding: 10px 14px;
          border: 2px solid var(--primary);
          border-radius: 40px;
          font-size: 14px;
          outline: none;
        }

        .barcode-input:focus {
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
        }

        .barcode-submit, .barcode-cancel {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .barcode-submit {
          background: #10b981;
          color: white;
        }

        .barcode-submit:hover {
          background: #059669;
          transform: scale(1.05);
        }

        .barcode-cancel {
          background: #ef4444;
          color: white;
        }

        .barcode-cancel:hover {
          background: #dc2626;
          transform: scale(1.05);
        }

        .scan-success {
          margin-top: 16px;
          padding: 12px 16px;
          background: #d1fae5;
          border: 1px solid #a7f3d0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #065f46;
          animation: slideIn 0.3s ease;
        }

        .success-icon {
          width: 20px;
          height: 20px;
          color: #059669;
        }

        .last-scanned {
          margin-top: 12px;
          padding: 8px 12px;
          background: var(--lavender-50);
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--gray-600);
        }

        .scanned-icon {
          width: 16px;
          height: 16px;
          color: var(--primary);
        }

        .scan-history {
          margin-top: 16px;
          background: var(--gray-50);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid var(--lavender-200);
          animation: slideDown 0.3s ease;
        }

        .history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .history-header h3 {
          font-size: 15px;
          font-weight: 600;
          color: var(--gray-700);
          margin: 0;
        }

        .history-header button {
          background: none;
          border: none;
          color: var(--gray-500);
          cursor: pointer;
          font-size: 18px;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .history-header button:hover {
          background: var(--gray-200);
          color: var(--gray-700);
        }

        .history-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .history-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid var(--gray-200);
        }

        .history-item:last-child {
          border-bottom: none;
        }

        .history-item-info {
          flex: 1;
        }

        .history-item-name {
          font-weight: 500;
          color: var(--gray-800);
          font-size: 14px;
          display: block;
          margin-bottom: 2px;
        }

        .history-item-barcode {
          font-size: 11px;
          color: var(--primary);
          background: var(--lavender-50);
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
          margin-right: 8px;
        }

        .history-item-time {
          font-size: 11px;
          color: var(--gray-500);
        }

        .history-item-qty {
          font-weight: 600;
          color: #059669;
          background: #d1fae5;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
        }

        /* Scanner Modal */
        .scanner-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 600px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          z-index: 1000;
          overflow: hidden;
          animation: modalFadeIn 0.3s ease;
        }

        .scanner-modal.fullscreen {
          width: 100vw;
          height: 100vh;
          max-width: none;
          border-radius: 0;
          top: 0;
          left: 0;
          transform: none;
        }

        .scanner-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: linear-gradient(135deg, var(--primary), var(--lavender-400));
          color: white;
        }

        .scanner-modal-header h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }

        .scanner-modal-actions {
          display: flex;
          gap: 8px;
        }

        .scanner-modal-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .scanner-modal-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }

        .scanner-modal-btn.close:hover {
          background: #ef4444;
        }

        .scanner-container {
          position: relative;
          width: 100%;
          height: 400px;
          background: #000;
          overflow: hidden;
        }

        .fullscreen .scanner-container {
          height: calc(100vh - 70px);
        }

        .scanner-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .scanner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .scan-area {
          position: relative;
          width: 80%;
          height: 200px;
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-radius: 16px;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
        }

        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #4ade80, transparent);
          animation: scan 2s linear infinite;
        }

        @keyframes scan {
          0% { top: 0; }
          50% { top: calc(100% - 2px); }
          100% { top: 0; }
        }

        .scan-instruction {
          margin-top: 20px;
          color: white;
          font-size: 14px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          background: rgba(0, 0, 0, 0.5);
          padding: 8px 16px;
          border-radius: 40px;
        }

        .scanner-loading, .scanner-error {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: white;
          z-index: 10;
        }

        .scanner-loading svg, .scanner-error svg {
          width: 40px;
          height: 40px;
          margin-bottom: 12px;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .retry-btn {
          margin-top: 12px;
          padding: 8px 16px;
          background: white;
          border: none;
          border-radius: 40px;
          color: var(--primary);
          font-weight: 500;
          cursor: pointer;
        }

        .retry-btn:hover {
          background: var(--lavender-50);
        }

        .item-barcode {
          font-size: 12px;
          color: var(--primary);
          background: var(--lavender-50);
          padding: 4px 8px;
          border-radius: 4px;
          font-family: monospace;
        }

        .min-stock {
          font-size: 13px;
          color: var(--gray-600);
          background: var(--gray-100);
          padding: 4px 8px;
          border-radius: 6px;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -48%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        .fullscreen .modalFadeIn {
          animation: none;
        }

        @media (max-width: 768px) {
          .scanner-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .scanner-actions {
            width: 100%;
            flex-direction: column;
          }
          
          .scanner-btn {
            width: 100%;
            justify-content: center;
          }
          
          .scanner-modal {
            width: 100%;
            height: 100%;
            border-radius: 0;
            top: 0;
            left: 0;
            transform: none;
          }
          
          .scanner-container {
            height: calc(100vh - 70px);
          }
        }
      `}</style>
    </div>
  );
}