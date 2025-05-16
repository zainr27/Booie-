
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, TrendingUp, BarChart, Shield, ChartLine, Users, Medal } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section with stunning background */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background image overlay */}
        <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center" />
        
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 hero-gradient" />
        
        {/* Content */}
        <div className="container-custom relative z-10 py-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-8">
              <h1 className="font-display text-gradient animate-fade-in">
                Finance Your Future, <br />Not Your Past
              </h1>
              
              <p className="text-xl text-booie-100 max-w-lg animate-fade-in">
                Booie provides student financing that aligns with your future success. 
                Our income-based repayment plans make education accessible and affordable 
                for the next generation of professionals.
              </p>
              
              <div className="flex flex-wrap gap-4 animate-fade-in">
                <Link to="/compare">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/20">
                    Compare Financing Plans
                  </Button>
                </Link>
                <Link to="/income-projection">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 backdrop-blur-sm">
                    Project Your Income
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2 animate-fade-in">
              <div className="glass-card p-8 md:p-10 rounded-2xl rotate-1 hover:rotate-0 transition-all duration-500 animate-float">
                <div className="mb-6">
                  <div className="h-2.5 w-20 bg-primary rounded-full mb-3 animate-pulse-soft"></div>
                  <div className="h-2.5 w-32 bg-white/30 rounded-full"></div>
                </div>
                
                <div className="flex justify-between mb-8">
                  <div>
                    <div className="text-sm text-white/70">Program Cost</div>
                    <div className="text-3xl font-display font-bold text-white">$45,000</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Monthly Payment</div>
                    <div className="text-3xl font-display font-bold text-primary">$280</div>
                  </div>
                </div>
                
                <div className="h-32 bg-gradient-to-r from-booie-600/30 to-booie-700/30 rounded-lg flex items-end p-4 mb-4">
                  <div className="h-1/3 w-1/6 bg-booie-300 rounded-sm mx-1"></div>
                  <div className="h-1/2 w-1/6 bg-booie-400 rounded-sm mx-1"></div>
                  <div className="h-2/3 w-1/6 bg-booie-500 rounded-sm mx-1"></div>
                  <div className="h-4/5 w-1/6 bg-booie-600 rounded-sm mx-1"></div>
                  <div className="h-full w-1/6 bg-booie-700 rounded-sm mx-1"></div>
                  <div className="h-3/4 w-1/6 bg-booie-500 rounded-sm mx-1"></div>
                </div>
                
                <Link to="/apply">
                  <Button className="w-full bg-white text-booie-900 hover:bg-booie-50">
                    Get Started Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="currentColor" fillOpacity="1" className="text-background" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,229.3C672,224,768,192,864,165.3C960,139,1056,117,1152,128C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 bg-image-pattern opacity-10"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-gradient mb-4">Why Choose Booie?</h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Our innovative approach to student financing puts your future first, 
              with transparent terms and flexible repayment options.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card">
              <CardContent className="pt-8 pb-8">
                <div className="mb-6 inline-flex p-4 rounded-full bg-booie-600/20">
                  <TrendingUp className="h-8 w-8 text-booie-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Income-Based Repayment</h3>
                <p className="text-foreground/70">
                  Payments that scale with your income, ensuring affordability at every career stage.
                </p>
              </CardContent>
            </div>
            
            <div className="feature-card">
              <CardContent className="pt-8 pb-8">
                <div className="mb-6 inline-flex p-4 rounded-full bg-booie-600/20">
                  <GraduationCap className="h-8 w-8 text-booie-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Student-First Design</h3>
                <p className="text-foreground/70">
                  Built specifically for students, not repurposed from traditional lending models.
                </p>
              </CardContent>
            </div>
            
            <div className="feature-card">
              <CardContent className="pt-8 pb-8">
                <div className="mb-6 inline-flex p-4 rounded-full bg-booie-600/20">
                  <BarChart className="h-8 w-8 text-booie-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Career Trajectory Analysis</h3>
                <p className="text-foreground/70">
                  Project your future earnings based on your program and make informed decisions.
                </p>
              </CardContent>
            </div>
          </div>
        </div>
      </section>
      
      {/* Advanced Features Section */}
      <section className="py-24 relative overflow-hidden texture-bg">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold font-display text-white">Advanced Financial <br /><span className="text-primary">Analytics Tools</span></h2>
              <p className="text-xl text-gray-300">
                Make data-driven decisions about your educational investment with our suite of financial planning tools.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-booie-600/20 mt-1">
                    <ChartLine className="h-5 w-5 text-booie-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Income Projection</h4>
                    <p className="text-gray-400">Visualize your future earnings potential based on industry data.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-booie-600/20 mt-1">
                    <Users className="h-5 w-5 text-booie-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Peer Comparison</h4>
                    <p className="text-gray-400">See how your financial plan compares to others in your field.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-booie-600/20 mt-1">
                    <Shield className="h-5 w-5 text-booie-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Payment Protection</h4>
                    <p className="text-gray-400">Payments adjust automatically if your income changes.</p>
                  </div>
                </div>
              </div>
              
              <Link to="/fees">
                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                  Explore Fee Structure
                </Button>
              </Link>
            </div>
            
            <div>
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-6 bg-gradient-to-br from-card to-muted">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xl font-medium">Income Projection</h4>
                    <Medal className="h-6 w-6 text-booie-500" />
                  </div>
                  
                  <div className="h-60 bg-gradient-to-br from-background to-secondary/90 rounded-lg flex items-end p-4 mb-4 relative">
                    {/* Simulated chart elements */}
                    <div className="absolute inset-0 flex items-end pl-4 pb-4">
                      <div className="h-1/6 w-1/12 bg-gray-700/50 rounded-t-sm"></div>
                      <div className="h-1/4 w-1/12 bg-gray-700/50 rounded-t-sm"></div>
                      <div className="h-2/6 w-1/12 bg-gray-700/50 rounded-t-sm"></div>
                      <div className="h-3/6 w-1/12 bg-gray-700/50 rounded-t-sm"></div>
                      <div className="h-4/6 w-1/12 bg-booie-700/70 rounded-t-sm"></div>
                      <div className="h-5/6 w-1/12 bg-booie-600/70 rounded-t-sm"></div>
                      <div className="h-5.5/6 w-1/12 bg-booie-500/70 rounded-t-sm"></div>
                      <div className="h-full w-1/12 bg-booie-400/70 rounded-t-sm"></div>
                    </div>
                    
                    {/* Line chart overlay */}
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path 
                        d="M0,100 L12.5,80 L25,65 L37.5,55 L50,45 L62.5,35 L75,25 L87.5,20 L100,15"
                        className="stroke-booie-500"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div className="text-gray-400">Year 1</div>
                    <div className="text-gray-400">Year 4</div>
                    <div className="text-gray-400">Year 8</div>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-900/40">
                  <div className="flex justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-400">Average Starting Salary</div>
                      <div className="text-xl font-bold text-white">$65,000</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">8-Year Growth</div>
                      <div className="text-xl font-bold text-booie-500">+87%</div>
                    </div>
                  </div>
                  
                  <Link to="/income-projection">
                    <Button className="w-full bg-gradient-to-r from-booie-600 to-booie-700 hover:from-booie-700 hover:to-booie-800">
                      Create Your Projection
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section with improved visibility and awesome design */}
      <section className="py-24 relative overflow-hidden texture-bg">
        {/* Background image with overlay */}
        <div className="absolute inset-0 bg-feature-pattern bg-cover bg-center opacity-20"></div>
        
        {/* Content */}
        <div className="container-custom relative z-10">
          <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border-t border-t-white/20">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="md:w-2/3 space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to invest in your education?</h2>
                  <p className="text-lg text-gray-300">
                    Get personalized financing options and see how Booie can help fund your educational journey.
                  </p>
                </div>
                <div className="md:w-1/3 flex justify-center md:justify-end">
                  <Link to="/signup">
                    <Button size="lg" className="bg-gradient-to-r from-booie-600 to-booie-700 hover:from-booie-700 hover:to-booie-800 text-white text-lg shadow-lg shadow-booie-700/30 transform hover:-translate-y-1 transition-all">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
