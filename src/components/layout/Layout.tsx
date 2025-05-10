
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import PageTransition from './PageTransition';
import { DisclosureFooter, ApplyCTA } from '@/components/shared';

interface LayoutProps {
  children: React.ReactNode;
  hideApplyCTA?: boolean;
  hideDisclosure?: boolean;
}

const Layout = ({ children, hideApplyCTA = false, hideDisclosure = false }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <PageTransition>
        <main className="flex-grow">
          {children}
          
          <div className="container-custom">
            {!hideDisclosure && <DisclosureFooter />}
            {!hideApplyCTA && <ApplyCTA />}
          </div>
        </main>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default Layout;
