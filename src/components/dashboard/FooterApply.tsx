
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FooterApply = () => {
  return (
    <div className="mt-4 border-t pt-6">
      <p className="text-sm text-muted-foreground mb-6 text-center">
        Income share agreements, such as Booie plans, are considered student loans.
      </p>
      <Link to="/apply" className="block w-full md:w-1/2 mx-auto">
        <Button className="w-full bg-booie-600 hover:bg-booie-700 text-lg py-6 transition-all" size="lg">
          Apply Now <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
};

export default FooterApply;
