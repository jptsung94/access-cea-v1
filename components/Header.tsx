import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger } from
'@/components/ui/tooltip';
import { useAccessCartStore } from './AccessCartStore';
import { useAccessStore } from './AccessStore';
import { UnifiedAccessModal } from './UnifiedAccessModal';
import { cn } from '@/lib/utils';

export function Header() {
  const cartItems = useAccessCartStore((state) => state.cartItems);
  const hasDraft = useAccessStore((state) => state.hasDraft());
  const location = useLocation();
  const [cartModalOpen, setCartModalOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleCartClick = () => {
    if (cartItems.length > 0) {
      setCartModalOpen(true);
    }
  };

  return (
    <>
      <header data-node-id="header_e778f1f4" className="sticky top-0 z-50 w-full border-b border-border bg-white">
        <div data-node-id="div_fb41f7a1" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-node-id="div_5624742b" className="flex h-14 items-center justify-between">
            <div data-node-id="div_bd82fd53" className="flex items-center gap-8">
              <Link data-node-id="link_8cb64a1e" to="/" className="flex items-center space-x-2">
                <span data-node-id="span_e042395b" className="text-lg font-semibold text-primary"><span data-node-id="span_d9525673" data-text-id="theexchange_6eb8b315" data-editable="jsx-text" className="protoforge-editable-text">The Exchange</span></span>
              </Link>

              <nav data-node-id="nav_4af3f335" className="hidden md:flex items-center space-x-6">
                <Link data-node-id="link_a30440a8"
                to="/"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  isActive('/') ? 'text-primary' : 'text-muted-foreground'
                )}><span data-node-id="span_45309e06" data-text-id="assets_b168f2ca" data-editable="jsx-text" className="protoforge-editable-text">Assets</span>


                </Link>
                <Link data-node-id="link_b06f8893"
                to="/my-access"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  isActive('/my-access') ? 'text-primary' : 'text-muted-foreground'
                )}><span data-node-id="span_e7caf0bd" data-text-id="myaccess_87025dc0" data-editable="jsx-text" className="protoforge-editable-text">My Access</span>


                </Link>
              </nav>
            </div>

            <div data-node-id="div_e3956cbd" className="flex items-center gap-4">
              <TooltipProvider data-node-id="tooltipprovider_06f83512" delayDuration={300}>
                <Tooltip data-node-id="tooltip_50cd5bc2">
                  <TooltipTrigger data-node-id="tooltiptrigger_ce29fe96" asChild>
                    <Button data-node-id="button_950b80ce"
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={handleCartClick}
                    aria-label={`Access cart with ${cartItems.length} items${
                    hasDraft ? ' and saved draft' : ''}`
                    }>

                      <ShoppingCart data-node-id="shoppingcart_cc807b3c" className="h-5 w-5" />
                      {cartItems.length > 0 &&
                      <Badge data-node-id="badge_5c40e9e1"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      variant="default">

                          <span data-node-id="span_0ae0ddd6" data-text-id="cartitemslen_29a575bc" data-editable="prop-path" data-prop-path="cartItems.length" className="protoforge-editable-text">{cartItems.length}</span>
                        </Badge>
                      }
                      {hasDraft &&
                      <div data-node-id="div_9f3956de" className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-primary border-2 border-white" />
                      }
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent data-node-id="tooltipcontent_a7297c8b">
                    <div data-node-id="div_87631ac1" className="text-sm">
                      {cartItems.length > 0 &&
                      <p data-node-id="p_23585f3a">
                          <span data-node-id="span_e52d40b4" data-text-id="cartitemslen_29a575bc" data-editable="prop-path" data-prop-path="cartItems.length" className="protoforge-editable-text">{cartItems.length}</span><span data-node-id="span_dd4adce2" data-text-id="item_58d9dc76" data-editable="jsx-text" className="protoforge-editable-text"> item</span>{cartItems.length !== 1 ? 's' : ''}<span data-node-id="span_35af22b8" data-text-id="incart_c9d3f99c" data-editable="jsx-text" className="protoforge-editable-text"> in cart</span>
                      </p>
                      }
                      {hasDraft && <p data-node-id="p_bdb6aa40" className="text-primary"><span data-node-id="span_c05ba72f" data-text-id="draftsaved_ea67aeb9" data-editable="jsx-text" className="protoforge-editable-text">Draft saved</span></p>}
                      {cartItems.length === 0 && !hasDraft && <p data-node-id="p_6c0da02b"><span data-node-id="span_8d93bb15" data-text-id="accesscart_1ab6d1b4" data-editable="jsx-text" className="protoforge-editable-text">Access cart</span></p>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Modal */}
      <UnifiedAccessModal data-node-id="unifiedaccessmodal_4200404e"
      open={cartModalOpen}
      onOpenChange={setCartModalOpen}
      assets={cartItems} />

    </>);

}