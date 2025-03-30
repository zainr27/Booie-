
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  return (
    <Layout>
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
        
        <div className="space-y-6 max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-medium">What is Booie?</AccordionTrigger>
              <AccordionContent className="text-gray-700">
                Booie is a financial planning tool designed specifically for education. We help students and parents make informed decisions about educational investments by providing income projections, loan calculators, and school comparisons.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl font-medium">How accurate are the income projections?</AccordionTrigger>
              <AccordionContent className="text-gray-700">
                Our income projections are based on historical data from various sources, including the Bureau of Labor Statistics and university employment reports. While we strive for accuracy, these projections should be used as estimates rather than guarantees, as individual outcomes may vary based on personal factors, economic conditions, and location.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl font-medium">How do I use the loan calculator?</AccordionTrigger>
              <AccordionContent className="text-gray-700">
                Our loan calculator allows you to input your loan amount, interest rate, and repayment term to estimate your monthly payments. You can also see how different repayment plans might affect your total cost of education. Simply navigate to the Loan Calculator page, enter your information, and get instant results.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-xl font-medium">What makes Booie different from traditional student loans?</AccordionTrigger>
              <AccordionContent className="text-gray-700">
                Unlike traditional loans that have fixed repayment terms regardless of your income, Booie's approach scales your payments based on how much you earn after graduation. This means lower payments when you're starting your career and reasonable increases as your income grows. We also provide comprehensive tools to help you understand the true cost of your education and make informed decisions.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-xl font-medium">Is my personal information secure?</AccordionTrigger>
              <AccordionContent className="text-gray-700">
                Yes, we take data security very seriously. We use industry-standard encryption and security protocols to protect your personal and financial information. We never share your data with third parties without your explicit consent, and we are fully compliant with all relevant privacy regulations.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-xl font-medium">Can I compare different schools and programs?</AccordionTrigger>
              <AccordionContent className="text-gray-700">
                Absolutely! Our comparison tool allows you to evaluate different educational paths based on factors like cost, potential income, program duration, and more. This helps you understand the return on investment for different educational choices and find the option that best aligns with your goals.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
