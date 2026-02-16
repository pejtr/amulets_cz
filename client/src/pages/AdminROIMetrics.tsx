import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, DollarSign, Users, Activity } from "lucide-react";

const ROI_IMAGE_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/89740521/fnVbvDbiWegdoUVO.png";

export default function AdminROIMetrics() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = ROI_IMAGE_URL;
    link.download = 'amulets-roi-metrics-visualization.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">ROI & Metrics Visualization Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive overview of project ROI, feature impact, and performance metrics
        </p>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">350-500%</div>
            <p className="text-xs text-muted-foreground">
              In 3-6 months
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Increase</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+104K CZK</div>
            <p className="text-xs text-muted-foreground">
              6 months projection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+5-15%</div>
            <p className="text-xs text-muted-foreground">
              Improvement expected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Traffic Growth</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+30-50%</div>
            <p className="text-xs text-muted-foreground">
              Multilingual (EN/IT)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Visualization */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>9 Detailed Charts & Insights</CardTitle>
              <CardDescription>
                ROI timeline, A/B testing results, traffic growth, conversion funnel, and more
              </CardDescription>
            </div>
            <Button onClick={handleDownload} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden border">
            <img 
              src={ROI_IMAGE_URL} 
              alt="ROI Metrics Visualization Dashboard" 
              className="w-full h-auto"
            />
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nejvyšší ROI</CardTitle>
            <CardDescription>Top performing features</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span>Widget A/B Testing</span>
                <span className="font-bold text-green-600">+30% ROI</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Instagram Feed Integration</span>
                <span className="font-bold text-green-600">+15% ROI</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Multilingual SEO (EN/IT)</span>
                <span className="font-bold text-green-600">+12% ROI</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nejvyšší Výsledky</CardTitle>
            <CardDescription>Time to results</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span>Widget A/B Testing</span>
                <span className="text-sm text-muted-foreground">7-14 days</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Instagram Feed</span>
                <span className="text-sm text-muted-foreground">2-3 weeks</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Multilingual SEO</span>
                <span className="text-sm text-muted-foreground">3-6 weeks</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Usage Notes */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Použití</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Dashboard můžeš použít pro:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Prezentace pro stakeholdery</li>
            <li>Investor pitch decks</li>
            <li>Internal reporting</li>
            <li>Marketing materiály</li>
            <li>Business plány</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
