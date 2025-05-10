
import React from 'react';
import LoanCalculatorContainer from '@/components/loan-calculator/LoanCalculatorContainer';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const LoanCalculator = () => {
  return (
    <Layout hideApplyCTA>
      <div className="container-custom py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="space-y-2 text-center mb-6">
            <h1 className="text-3xl font-bold">Loan Calculator</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how your Booie Plan can work for you with our interactive calculator.
              Adjust parameters to find the perfect financial solution for your education.
            </p>
          </div>
          
          <Card className="border border-border/50 shadow-lg">
            <CardContent className="p-6">
              <LoanCalculatorContainer />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default LoanCalculator;
