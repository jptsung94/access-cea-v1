import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/Header';
import { AssetDetailPage } from '@/components/AssetDetailPage';
import { MyAccessPage } from '@/components/MyAccessPage';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <BrowserRouter data-node-id="browserrouter_cdd2c305">
      <div data-node-id="div_19ebe847" className="min-h-screen bg-background text-foreground">
        <Header data-node-id="header_433eca5e" />
        <Routes data-node-id="routes_ee959d07">
          <Route data-node-id="route_db4674de" path="/my-access" element={<MyAccessPage data-node-id="myaccesspage_f8e906a1" />} />
          <Route data-node-id="route_317b1e23" path="*" element={<AssetDetailPage data-node-id="assetdetailpage_96f0905d" />} />
        </Routes>
        <Toaster data-node-id="toaster_13dc49a1" />
      </div>
    </BrowserRouter>);

}

export default App;