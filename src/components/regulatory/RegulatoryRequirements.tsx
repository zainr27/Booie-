
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const RegulatoryRequirements = () => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Regulatory Requirements</CardTitle>
        <CardDescription>
          Compliance with lending and financial regulations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="frontend">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
            <TabsTrigger value="backend">Backend</TabsTrigger>
          </TabsList>
          
          <TabsContent value="frontend" className="mt-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="tila">
                <AccordionTrigger className="font-semibold">
                  Truth in Lending Act (TILA)
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5">
                    <li>
                      Written disclosures concerning finance charges and other aspects (e.g., disclosing an annual percentage rate)
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="aml-kyc">
                <AccordionTrigger className="font-semibold">
                  Anti Money Laundering (AML) and Know Your Client (KYC)
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5">
                    <li>Require customer identity verification</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="ecoa">
                <AccordionTrigger className="font-semibold">
                  Equal Credit Opportunity Act (ECOA)
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5">
                    <li>No discrimination in approval algorithm based on protected factors</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="glb-privacy">
                <AccordionTrigger className="font-semibold">
                  Gramm-Leach-Bliley (GLB) Act Privacy Rule
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5">
                    <li>
                      "Clear and conspicuous" written notice describing privacy policies and practices hyperlinked directly from a page where transactions are conducted, with loan approval contingent on acknowledgement of reception
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="dodd-frank">
                <AccordionTrigger className="font-semibold">
                  Dodd-Frank Act (UDAAP)
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5">
                    <li>
                      All statements must not be false or misleading and all fees must be clearly disclosed
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="student-rights">
                <AccordionTrigger className="font-semibold">
                  Student Borrower Rights
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5">
                    <li>Statement informing students of federal options</li>
                    <li>Visual comparing rates to other options</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          
          <TabsContent value="backend" className="mt-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="glb-safeguards">
                <AccordionTrigger className="font-semibold">
                  Gramm-Leach-Bliley (GLB) Act Safeguards Rule
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Implement access controls</li>
                    <li>Inventory all data collection, storage, and transmission</li>
                    <li>Inventory all systems, devices, and platforms</li>
                    <li>Encrypt all customer information on the system and when in transit</li>
                    <li>Implement multi-factor authentication for anyone accessing customer information on the system</li>
                    <li>Draft change management plan for information security</li>
                    <li>Create log of authorized activity and implement system to continuously detect and flag unauthorized access</li>
                    <li>Draft information security onboarding document for any new staff</li>
                    <li>Draft security incident response plan</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
