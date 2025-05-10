
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageTransition from '@/components/layout/PageTransition';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CirclePercent } from 'lucide-react';
import DisclosureFooter from '@/components/loan-comparison/DisclosureFooter';
import BooieFeesStructure from '@/components/fees/BooieFeesStructure';
import FeeComparison from '@/components/fees/FeeComparison';
import FeeExamples from '@/components/fees/FeeExamples';

const Fees = () => {
  return (
    <Layout>
      <PageTransition>
        <div className="container-custom py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Fee Structure</h1>
            <p className="text-gray-600">
              At Booie, we believe in transparent pricing with no hidden costs or surprises. 
              Here's a breakdown of our fee structure compared to traditional lending options.
            </p>
          </div>
          
          <Tabs defaultValue="booie">
            <TabsList className="mb-8 w-full sm:w-auto">
              <TabsTrigger value="booie" className="flex-1 sm:flex-initial">Booie Fee Structure</TabsTrigger>
              <TabsTrigger value="comparison" className="flex-1 sm:flex-initial">Comparison with Others</TabsTrigger>
              <TabsTrigger value="examples" className="flex-1 sm:flex-initial">Fee Examples</TabsTrigger>
            </TabsList>
            
            <TabsContent value="booie" className="outline-none">
              <BooieFeesStructure />
            </TabsContent>
            
            <TabsContent value="comparison" className="outline-none">
              <FeeComparison />
            </TabsContent>
            
            <TabsContent value="examples" className="outline-none">
              <FeeExamples />
            </TabsContent>
          </Tabs>
          
          <div className="mt-10">
            <DisclosureFooter />
          </div>
          
          <div className="mt-10 flex justify-center">
            <Link to="/apply">
              <Button size="lg" className="bg-booie-600 hover:bg-booie-700 text-white font-bold py-3 px-8 rounded-md transition-all flex items-center gap-2">
                <CirclePercent className="h-5 w-5" />
                Apply for a Booie Plan
              </Button>
            </Link>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Fees;
