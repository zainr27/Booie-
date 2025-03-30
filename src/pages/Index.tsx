
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, TrendingUp, Calculator, BarChart } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-booie-800 to-booie-600 text-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-5xl font-bold leading-tight text-white">
                Finance Your Future, Not Your Past
              </h1>
              <p className="text-xl text-booie-100">
                Booie provides student financing that aligns with your future success, 
                not your past credit history. Our income-based repayment plans make education 
                accessible and affordable.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/loan-calculator">
                  <Button size="lg" className="bg-white text-booie-700 hover:bg-booie-100">
                    Calculate Your Loan
                  </Button>
                </Link>
                <Link to="/income-projection">
                  <Button size="lg" variant="outline" className="border-white text-booie-700 hover:bg-booie-100">
                    Project Your Income
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80" 
                alt="Student using laptop" 
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Booie?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our innovative approach to student financing puts your future first, 
              with transparent terms and flexible repayment options.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex p-3 rounded-full bg-booie-100">
                  <TrendingUp className="h-6 w-6 text-booie-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Income-Based Repayment</h3>
                <p className="text-gray-600">
                  Payments that scale with your income, ensuring affordability at every career stage.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex p-3 rounded-full bg-booie-100">
                  <Calculator className="h-6 w-6 text-booie-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Transparent Calculations</h3>
                <p className="text-gray-600">
                  Clear terms and interactive tools help you understand the full cost of your education.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex p-3 rounded-full bg-booie-100">
                  <GraduationCap className="h-6 w-6 text-booie-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Student-First Design</h3>
                <p className="text-gray-600">
                  Built specifically for students, not repurposed from traditional lending models.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex p-3 rounded-full bg-booie-100">
                  <BarChart className="h-6 w-6 text-booie-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Career Trajectory Analysis</h3>
                <p className="text-gray-600">
                  Project your future earnings based on your program and make informed decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section with improved visibility */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-2/3 space-y-4">
                <h2 className="text-3xl font-bold text-gray-900">Ready to invest in your education?</h2>
                <p className="text-lg text-gray-700">
                  Get personalized loan options and see how Booie can help finance your educational journey.
                </p>
              </div>
              <div className="md:w-1/3 flex justify-center md:justify-end">
                <Link to="/signup">
                  <Button size="lg" className="bg-booie-600 hover:bg-booie-700 text-white">
                    Apply Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
