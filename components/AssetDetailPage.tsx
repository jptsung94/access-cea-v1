import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Lock, Users, ExternalLink, FileText } from 'lucide-react';
import { MOCK_CUSTOMER_PROFILE_API, MOCK_CUSTOMER_TRANSACTIONS_DATASET, MOCK_MARKETING_LEADS_DATASET } from '@/lib/mockData';
import { useAccessCartStore } from './AccessCartStore';
import { useAccessStore } from './AccessStore';
import { UnifiedAccessModal } from './UnifiedAccessModal';

export function AssetDetailPage() {
  const asset = MOCK_CUSTOMER_PROFILE_API;
  const [modalOpen, setModalOpen] = useState(false);
  const { addToCart, isInCart } = useAccessCartStore();
  const inCart = isInCart(asset.id);
  const hasDraft = useAccessStore((state) => state.hasDraft());
  const addMultipleToCart = useAccessCartStore((state) => state.addToCart);

  const handleRequestAccess = () => {
    setModalOpen(true);
  };

  const handleAddToCart = () => {
    addToCart(asset);
  };

  const handleAddDatasetSamples = () => {
    // Add dataset samples to cart for testing
    addMultipleToCart(MOCK_CUSTOMER_TRANSACTIONS_DATASET);
    addMultipleToCart(MOCK_MARKETING_LEADS_DATASET);
  };

  return (
    <>
      <div data-node-id="div_4e3837a5" className="page-shell">
        <div data-node-id="div_5a7b9843" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div data-node-id="div_2a58280e" className="breadcrumb mb-6 text-muted-foreground">
            <span data-node-id="span_5ba13cdd"><span data-node-id="span_4213ca1b" data-text-id="assets_b168f2ca" data-editable="jsx-text" className="protoforge-editable-text">Assets</span></span>
            <span data-node-id="span_a247c883" className="breadcrumb-separator mx-1">/</span>
            <span data-node-id="span_4d11cc36"><span data-node-id="span_87f3ad16" data-text-id="apis_236a94c7" data-editable="jsx-text" className="protoforge-editable-text">APIs</span></span>
            <span data-node-id="span_a247c883_1" className="breadcrumb-separator mx-1">/</span>
            <span data-node-id="span_24019e0a" className="text-foreground font-medium"><span data-node-id="span_4bc08244" data-text-id="assetname_12624a99" data-editable="prop-path" data-prop-path="asset.name" className="protoforge-editable-text">{asset.name}</span></span>
          </div>

          <div data-node-id="div_e62d33bb" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div data-node-id="div_ed0bb20a" className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div data-node-id="div_713c2fba">
                <div data-node-id="div_01b43244" className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 data-node-id="h1_0e5ab1f8" className="text-3xl font-semibold text-primary"><span data-node-id="span_4cfde255" data-text-id="assetname_12624a99" data-editable="prop-path" data-prop-path="asset.name" className="protoforge-editable-text">{asset.name}</span></h1>
                  <Badge data-node-id="badge_012dd7ad" variant="secondary">{asset.type.toUpperCase()}</Badge>
                </div>
                <p data-node-id="p_26ff9fbe" className="text-muted-foreground"><span data-node-id="span_2fa009b0" data-text-id="assetdescrip_a59e2952" data-editable="prop-path" data-prop-path="asset.description" className="protoforge-editable-text">{asset.description}</span></p>
              </div>

              {/* Draft Notice */}
              {hasDraft &&
              <div data-node-id="div_dbbc70d7" className="flex items-center gap-3 p-4 rounded-md bg-blue-50 border border-blue-200">
                  <FileText data-node-id="filetext_207b7b23" className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div data-node-id="div_5499ffe1" className="flex-1">
                    <p data-node-id="p_5aec5a77" className="text-sm font-medium text-blue-900"><span data-node-id="span_f92125d6" data-text-id="youhaveasave_0b31f2ce" data-editable="jsx-text" className="protoforge-editable-text">You have a saved draft</span></p>
                    <p data-node-id="p_0423cbee" className="text-sm text-blue-700"><span data-node-id="span_639ce24e" data-text-id="continueyour_41cf292f" data-editable="jsx-text" className="protoforge-editable-text">Continue your access request where you left off.</span></p>
                  </div>
                  <Button data-node-id="button_79e53ab7"
                variant="outline"
                size="sm"
                onClick={handleRequestAccess}
                className="border-blue-300 hover:bg-blue-100"><span data-node-id="span_97e68241" data-text-id="opendraft_7fee12bb" data-editable="jsx-text" className="protoforge-editable-text">Open Draft</span>


                </Button>
                </div>
              }

              {/* Action Buttons */}
              <div data-node-id="div_abce51a8" className="flex flex-wrap gap-3">
                <Button data-node-id="button_3a9c9db5" onClick={handleRequestAccess} size="lg">
                  <Lock data-node-id="lock_3edd3e7b" className="mr-2 h-4 w-4" /><span data-node-id="span_c5fed681" data-text-id="requestacces_17c11a1a" data-editable="jsx-text" className="protoforge-editable-text">Request Access</span>

                </Button>

                <Button data-node-id="button_cc27f6db"
                variant="outline"
                onClick={handleAddToCart}
                disabled={inCart}
                size="lg">

                  <ShoppingCart data-node-id="shoppingcart_d815e734" className="mr-2 h-4 w-4" />
                  {inCart ? 'In Cart' : 'Add to Cart'}
                </Button>

                <Button data-node-id="button_104d86c5"
                variant="secondary"
                onClick={handleAddDatasetSamples}
                size="lg"><span data-node-id="span_0e73cc3a" data-text-id="adddatasetsa_8d97c09f" data-editable="jsx-text" className="protoforge-editable-text">Add Dataset Samples</span>


                </Button>
              </div>

              <Separator data-node-id="separator_9b77e271" />

              {/* Asset Details */}
              <Card data-node-id="card_d3f1743e">
                <CardHeader data-node-id="cardheader_f5a2ab74">
                  <CardTitle data-node-id="cardtitle_7c53ecf0"><span data-node-id="span_7e0f0852" data-text-id="assetinforma_ac4f65a3" data-editable="jsx-text" className="protoforge-editable-text">Asset Information</span></CardTitle>
                </CardHeader>
                <CardContent data-node-id="cardcontent_2e05bf52" className="space-y-4">
                  <div data-node-id="div_4b517055" className="grid grid-cols-2 gap-4">
                    <div data-node-id="div_ff4e4ff0">
                      <div data-node-id="div_e0606f54" className="text-sm font-medium text-muted-foreground mb-1"><span data-node-id="span_605cbf98" data-text-id="assettype_4eb0ab42" data-editable="jsx-text" className="protoforge-editable-text">Asset Type</span></div>
                      <div data-node-id="div_f7ae86c6" className="font-medium text-foreground">{asset.type.toUpperCase()}</div>
                    </div>

                    <div data-node-id="div_ff4e4ff0_1">
                      <div data-node-id="div_a5d51897" className="text-sm font-medium text-muted-foreground mb-1"><span data-node-id="span_8ab61026" data-text-id="owner_62f484d8" data-editable="jsx-text" className="protoforge-editable-text">Owner</span></div>
                      <div data-node-id="div_2eb6ca80" className="font-medium text-foreground"><span data-node-id="span_9053dfd4" data-text-id="assetowner_8fee2b42" data-editable="prop-path" data-prop-path="asset.owner" className="protoforge-editable-text">{asset.owner}</span></div>
                    </div>

                    <div data-node-id="div_ff4e4ff0_2">
                      <div data-node-id="div_2fe63d1e" className="text-sm font-medium text-muted-foreground mb-1"><span data-node-id="span_4b6a90d3" data-text-id="ratelimit_b6f98976" data-editable="jsx-text" className="protoforge-editable-text">Rate Limit</span></div>
                      <div data-node-id="div_d5c3f89c" className="font-medium text-foreground"><span data-node-id="span_12569efc" data-text-id="1000reqmin_745e6987" data-editable="jsx-text" className="protoforge-editable-text">1000 req/min</span></div>
                    </div>

                    <div data-node-id="div_ff4e4ff0_3">
                      <div data-node-id="div_37f8ba68" className="text-sm font-medium text-muted-foreground mb-1"><span data-node-id="span_f5e8f34f" data-text-id="environment_3afa6a69" data-editable="jsx-text" className="protoforge-editable-text">Environment</span></div>
                      <div data-node-id="div_75938a66" className="font-medium text-foreground"><span data-node-id="span_1e3cb232" data-text-id="production_b260df2d" data-editable="jsx-text" className="protoforge-editable-text">Production</span></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* API Endpoints */}
              <Card data-node-id="card_d3f1743e_1">
                <CardHeader data-node-id="cardheader_f0d21924">
                  <CardTitle data-node-id="cardtitle_7a3a0802"><span data-node-id="span_349e0221" data-text-id="availableend_001db23b" data-editable="jsx-text" className="protoforge-editable-text">Available Endpoints</span></CardTitle>
                  <CardDescription data-node-id="carddescription_8df307a1"><span data-node-id="span_a5cfa114" data-text-id="restapiendpo_f8e76431" data-editable="jsx-text" className="protoforge-editable-text">REST API endpoints for customer profile operations</span></CardDescription>
                </CardHeader>
                <CardContent data-node-id="cardcontent_e0214a7b">
                  <div data-node-id="div_8507e64a" className="space-y-3">
                    {[
                    { method: 'GET', path: '/api/v1/customers/{id}', desc: 'Get customer by ID' },
                    { method: 'GET', path: '/api/v1/customers', desc: 'List customers' },
                    { method: 'POST', path: '/api/v1/customers', desc: 'Create customer' },
                    { method: 'PUT', path: '/api/v1/customers/{id}', desc: 'Update customer' }].
                    map((endpoint, i) =>
                    <div data-node-id="div_e1c70851" key={i} className="flex items-start gap-3 p-3 rounded-md border bg-white">
                        <Badge data-node-id="badge_3b5811ce" variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                          <span data-node-id="span_405e9e8e" data-text-id="endpointmeth_aa583447" data-editable="prop-path" data-prop-path="endpoint.method" className="protoforge-editable-text">{endpoint.method}</span>
                        </Badge>
                        <div data-node-id="div_6f61581f" className="flex-1">
                          <code data-node-id="code_5b178ce7" className="text-sm font-mono text-foreground"><span data-node-id="span_db5aa9fb" data-text-id="endpointpath_5a2242a3" data-editable="prop-path" data-prop-path="endpoint.path" className="protoforge-editable-text">{endpoint.path}</span></code>
                          <p data-node-id="p_c290c589" className="text-sm text-muted-foreground mt-1"><span data-node-id="span_7e4442c3" data-text-id="endpointdesc_f6c23995" data-editable="prop-path" data-prop-path="endpoint.desc" className="protoforge-editable-text">{endpoint.desc}</span></p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div data-node-id="div_8486707a" className="space-y-6">
              {/* Quick Access Info */}
              <Card data-node-id="card_54874c0b">
                <CardHeader data-node-id="cardheader_485bfb4b">
                  <CardTitle data-node-id="cardtitle_d4340e67" className="text-lg"><span data-node-id="span_20fd5c04" data-text-id="accessinform_02ecccdc" data-editable="jsx-text" className="protoforge-editable-text">Access Information</span></CardTitle>
                </CardHeader>
                <CardContent data-node-id="cardcontent_577ea6db" className="space-y-4">
                  <div data-node-id="div_fc9801b9" className="flex items-start gap-3">
                    <Users data-node-id="users_a57dd80a" className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div data-node-id="div_ee6296a6">
                      <div data-node-id="div_b16ffed9" className="font-medium text-sm text-foreground"><span data-node-id="span_142dec7b" data-text-id="approvalrequ_f2ed2503" data-editable="jsx-text" className="protoforge-editable-text">Approval Required From</span></div>
                      <div data-node-id="div_503cf218" className="text-sm text-muted-foreground"><span data-node-id="span_2ca6362f" data-text-id="managerdatao_18ced5cd" data-editable="jsx-text" className="protoforge-editable-text">Manager, Data Owner</span></div>
                    </div>
                  </div>

                  <Separator data-node-id="separator_27689d4e" />

                  <div data-node-id="div_759e3f74">
                    <div data-node-id="div_a5de6be4" className="font-medium text-sm mb-2 text-foreground"><span data-node-id="span_a66de81f" data-text-id="prerequisite_7be43bff" data-editable="jsx-text" className="protoforge-editable-text">Prerequisites</span></div>
                    <ul data-node-id="ul_45de89c4" className="space-y-1 text-sm text-muted-foreground">
                      <li data-node-id="li_06534c3f"><span data-node-id="span_d591977d" data-text-id="dataprivacys_34e345ad" data-editable="jsx-text" className="protoforge-editable-text">• Data Privacy &amp; Security CBT</span></li>
                      <li data-node-id="li_7aa52b5a"><span data-node-id="span_fbe8c806" data-text-id="apisecurityc_e94faec1" data-editable="jsx-text" className="protoforge-editable-text">• API Security CBT</span></li>
                      <li data-node-id="li_ace08bfc"><span data-node-id="span_56c7da22" data-text-id="asvscanresul_ce70bc78" data-editable="jsx-text" className="protoforge-editable-text">• ASV Scan Results (for machine access)</span></li>
                      <li data-node-id="li_14fd3a2d"><span data-node-id="span_44a31233" data-text-id="dataclassifi_3569a61c" data-editable="jsx-text" className="protoforge-editable-text">• Data Classification Acknowledgment</span></li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Help Card */}
              <Card data-node-id="card_54874c0b_1" className="bg-muted/30 border-border">
                <CardHeader data-node-id="cardheader_fc62c1c3">
                  <CardTitle data-node-id="cardtitle_d027e057" className="text-lg"><span data-node-id="span_79ce7a04" data-text-id="needhelp_ecbcabca" data-editable="jsx-text" className="protoforge-editable-text">Need Help?</span></CardTitle>
                </CardHeader>
                <CardContent data-node-id="cardcontent_50bcb80a" className="space-y-3">
                  <p data-node-id="p_bce99cd2" className="text-sm text-muted-foreground"><span data-node-id="span_5bc3da99" data-text-id="reviewaccess_657e55a7" data-editable="jsx-text" className="protoforge-editable-text">Review access request guides for detailed information about prerequisites, required details, and approval workflows.</span>

                  </p>
                  <Button data-node-id="button_c43f1e90" variant="outline" size="sm" className="w-full">
                    <ExternalLink data-node-id="externallink_3a6d95af" className="mr-2 h-4 w-4" /><span data-node-id="span_ba3f2ca9" data-text-id="viewdocument_59d36339" data-editable="jsx-text" className="protoforge-editable-text">View Documentation</span>

                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <UnifiedAccessModal data-node-id="unifiedaccessmodal_51b3e064"
      open={modalOpen}
      onOpenChange={setModalOpen}
      assets={[asset]} />

    </>);

}