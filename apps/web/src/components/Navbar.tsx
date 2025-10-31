'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { Button } from '@ui/Button';
import { HeartIcon, PersonIcon } from '@radix-ui/react-icons';

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const toggleMiniCart = useUIStore((state) => state.toggleMiniCart);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold">
            ShoeParadise
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/products" className="text-sm font-medium hover:underline">
              Products
            </Link>
            <Link href="/products?gender=MEN" className="text-sm font-medium hover:underline">
              Men
            </Link>
            <Link href="/products?gender=WOMEN" className="text-sm font-medium hover:underline">
              Women
            </Link>
            <Link href="/products?featured=true" className="text-sm font-medium hover:underline">
              Featured
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/account/wishlist">
                <Button variant="ghost" size="icon" aria-label="Wishlist">
                  <HeartIcon className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMiniCart}
                aria-label="Shopping cart"
              >
                <span className="text-xl">🛒</span>
              </Button>
              <Link href="/account">
                <Button variant="ghost" size="icon" aria-label="Account">
                  <PersonIcon className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearAuth()}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/account/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/account/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
