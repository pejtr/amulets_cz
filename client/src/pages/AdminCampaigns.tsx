import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

export default function AdminCampaigns() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [campaignType, setCampaignType] = useState<'amuletToOhorai' | 'ohoraiToAmulets' | 'vipOffer'>('amuletToOhorai');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendCampaignMutation = trpc.email.sendCampaignEmail.useMutation();

  const handleSendCampaign = async () => {
    if (!email) {
      setMessage('Prosím zadej email');
      return;
    }

    setLoading(true);
    try {
      const result = await sendCampaignMutation.mutateAsync({
        email,
        campaignType,
        firstName: firstName || undefined,
      });

      if (result.success) {
        setMessage(`✅ Email úspěšně odeslán na ${email}`);
        setEmail('');
        setFirstName('');
      } else {
        setMessage(`❌ Chyba: ${result.message}`);
      }
    } catch (error: any) {
      setMessage(`❌ Chyba: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Only allow admin access
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-red-600">Přístup Odepřen</h1>
          <p className="mt-4 text-gray-600">Tato stránka je dostupná pouze pro administrátory.</p>
        </Card>
      </div>
    );
  }

  const campaigns = [
    {
      id: 'amuletToOhorai',
      name: 'Amulets → OHORAI',
      description: 'Nový zákazník Amulets.cz - nabídka OHORAI',
      discount: 'AMULETS15 (15%)',
    },
    {
      id: 'ohoraiToAmulets',
      name: 'OHORAI → Amulets',
      description: 'Nový zákazník OHORAI - nabídka Amulets.cz',
      discount: 'OHORAI20 (20%)',
    },
    {
      id: 'vipOffer',
      name: 'VIP Nabídka',
      description: 'VIP zákazníci obou webů - speciální nabídka',
      discount: 'VIP30 (30%)',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-900 mb-2">📧 Brevo Email Kampaně</h1>
        <p className="text-gray-600 mb-8">Správa a testování email kampaní pro cross-promotion</p>

        {/* Campaign Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className={`p-4 cursor-pointer transition ${
                campaignType === campaign.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setCampaignType(campaign.id as any)}
            >
              <h3 className="font-bold text-lg text-purple-900">{campaign.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{campaign.description}</p>
              <p className="text-sm font-semibold text-purple-600 mt-3">Sleva: {campaign.discount}</p>
            </Card>
          ))}
        </div>

        {/* Email Form */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Odeslat Test Email</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Adresa
              </label>
              <Input
                type="email"
                placeholder="test@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jméno (volitelné)
              </label>
              <Input
                type="text"
                placeholder="Jan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Vybraná kampaň:</strong> {campaigns.find(c => c.id === campaignType)?.name}
              </p>
            </div>

            <Button
              onClick={handleSendCampaign}
              disabled={loading || !email}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3"
            >
              {loading ? 'Odesílání...' : '📧 Odeslat Email'}
            </Button>

            {message && (
              <div className={`p-4 rounded-lg ${
                message.startsWith('✅')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}
          </div>
        </Card>

        {/* Campaign Details */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detaily Kampaní</h2>

          <div className="space-y-8">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border-b pb-8 last:border-b-0">
                <h3 className="text-xl font-bold text-purple-900 mb-4">{campaign.name}</h3>

                {campaign.id === 'amuletToOhorai' && (
                  <div className="space-y-3 text-sm text-gray-700">
                    <p><strong>Předmět:</strong> Objevte Prémiovou Kolekci OHORAI - Exkluzivní Nabídka</p>
                    <p><strong>Cíl:</strong> Nový zákazník Amulets.cz</p>
                    <p><strong>Sleva:</strong> 15% (kód: AMULETS15)</p>
                    <p><strong>CTA:</strong> Prozkoumat OHORAI</p>
                    <p><strong>Obsah:</strong> Představení OHORAI kolekce (krystaly, pyramidy, esence, šperky)</p>
                  </div>
                )}

                {campaign.id === 'ohoraiToAmulets' && (
                  <div className="space-y-3 text-sm text-gray-700">
                    <p><strong>Předmět:</strong> Objevte Spirituální Symboly - Nová Kolekce Amulets.cz</p>
                    <p><strong>Cíl:</strong> Nový zákazník OHORAI</p>
                    <p><strong>Sleva:</strong> 20% (kód: OHORAI20)</p>
                    <p><strong>CTA:</strong> Prozkoumat Amulets.cz</p>
                    <p><strong>Obsah:</strong> Představení Amulets.cz (33 symbolů, průvodce, horoskop, magazín)</p>
                  </div>
                )}

                {campaign.id === 'vipOffer' && (
                  <div className="space-y-3 text-sm text-gray-700">
                    <p><strong>Předmět:</strong> 🌟 VIP Exkluzivní Nabídka 🌟</p>
                    <p><strong>Cíl:</strong> VIP zákazníci obou webů</p>
                    <p><strong>Sleva:</strong> 30% (kód: VIP30)</p>
                    <p><strong>Benefity:</strong> 30% sleva, bezplatná doprava, prioritní servis</p>
                    <p><strong>Trvání:</strong> 30 dní</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Metrics */}
        <Card className="p-8 mt-8 bg-gradient-to-r from-purple-50 to-pink-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Očekávané Metriky</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600">Open Rate</p>
              <p className="text-2xl font-bold text-purple-600">25-35%</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600">Click Rate</p>
              <p className="text-2xl font-bold text-purple-600">5-10%</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600">Conversion</p>
              <p className="text-2xl font-bold text-purple-600">2-3%</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600">Roční Výtěžnost</p>
              <p className="text-2xl font-bold text-purple-600">+680K Kč</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
