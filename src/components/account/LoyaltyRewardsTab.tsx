import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  Crown,
  Check,
  Gift,
  ArrowRight,
  History,
  Copy,
  Tag,
  Calendar,
  ShoppingBag,
  Zap,
  Scissors,
  CheckCircle2,
  Ticket,
  AlertCircle,
  Package,
  Layers,
  Search,
} from 'lucide-react';
import { LoyaltyProfile, LoyaltyTierLevel, RewardCatalogItem, UnlockedReward, RewardCategory } from '../../types';
import {
  getUserLoyalty,
  saveUserLoyalty,
  TIER_CONFIG,
  calculateTier,
  REWARDS_CATALOG,
  getUnlockedRewards,
  redeemRewardCatalogItem,
} from '../../utils/accountData';
import { formatINR } from '../../utils/currency';

interface LoyaltyRewardsTabProps {
  onShowToast?: (msg: string, type?: 'cart' | 'wishlist' | 'info') => void;
  onOpenBooking?: () => void;
  onNavigateToShop?: () => void;
}

export const LoyaltyRewardsTab: React.FC<LoyaltyRewardsTabProps> = ({
  onShowToast,
  onOpenBooking,
  onNavigateToShop,
}) => {
  const [profile, setProfile] = useState<LoyaltyProfile>(getUserLoyalty);
  const [unlockedRewards, setUnlockedRewards] = useState<UnlockedReward[]>(getUnlockedRewards);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedTierDetail, setSelectedTierDetail] = useState<LoyaltyTierLevel>(profile.tier);
  const [activeCatalogCategory, setActiveCatalogCategory] = useState<RewardCategory>('all');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const currentTierMeta = TIER_CONFIG[profile.tier];
  const tiersList: LoyaltyTierLevel[] = ['Bronze', 'Silver', 'Gold', 'Platinum'];

  const getNextTierName = () => {
    if (profile.tier === 'Bronze') return 'Silver Radiance';
    if (profile.tier === 'Silver') return 'Gold VIP';
    if (profile.tier === 'Gold') return 'Platinum Elite';
    return 'Platinum Elite (Max Tier)';
  };

  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      if (onShowToast) {
        onShowToast(`Voucher code "${code}" copied to clipboard!`, 'info');
      }
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  const handleRedeemCatalogReward = (reward: RewardCatalogItem) => {
    if (profile.pointsBalance < reward.requiredPoints) {
      if (onShowToast) {
        onShowToast(
          `You need ${reward.requiredPoints - profile.pointsBalance} more points to redeem ${reward.title}.`,
          'info'
        );
      }
      return;
    }

    setRedeemingId(reward.id);
    setTimeout(() => {
      const result = redeemRewardCatalogItem(reward);
      if (result.success && result.unlockedReward) {
        setProfile(getUserLoyalty());
        setUnlockedRewards(getUnlockedRewards());
        if (onShowToast) {
          onShowToast(
            `🎉 Unlocked "${reward.title}" for ${reward.requiredPoints} Aura Points! Code: ${result.unlockedReward.code}`,
            'info'
          );
        }
        handleCopyCode(result.unlockedReward.code);
      } else if (result.error && onShowToast) {
        onShowToast(result.error, 'info');
      }
      setRedeemingId(null);
    }, 300);
  };

  // Filter Catalog Items
  const filteredCatalog = REWARDS_CATALOG.filter((item) => {
    const matchCategory =
      activeCatalogCategory === 'all' || item.category === activeCatalogCategory;
    const matchSearch =
      !catalogSearch.trim() ||
      item.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.codePrefix.toLowerCase().includes(catalogSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Tier Status Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F3A26] via-[#2A4D35] to-[#142619] p-6 text-white shadow-lg border border-[#C9A66B]/30">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[#C9A66B]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#C9A66B]/20 text-[#E5C78A] flex items-center justify-center border border-[#C9A66B]/40 shadow-inner">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#E5C78A] tracking-wider block">
                  Current Status
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                  {currentTierMeta.name}
                </h3>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-right">
              <span className="text-[10px] uppercase font-bold text-gray-300 tracking-wider block">
                Available Aura Points
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#E5C78A] font-heading">
                {profile.pointsBalance.toLocaleString()} <span className="text-xs font-normal text-white">pts</span>
              </span>
              <span className="text-[10px] text-gray-300 block mt-0.5">
                ≈ {formatINR(Math.round(profile.pointsBalance / 10))} store &amp; salon value
              </span>
            </div>
          </div>

          {/* Visual Multi-Tier Step Track */}
          <div className="pt-2">
            <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-2 text-center">
              {tiersList.map((tierName, idx) => {
                const isPassedOrCurrent =
                  profile.tier === 'Platinum' ||
                  (profile.tier === 'Gold' && tierName !== 'Platinum') ||
                  (profile.tier === 'Silver' && (tierName === 'Bronze' || tierName === 'Silver')) ||
                  (profile.tier === 'Bronze' && tierName === 'Bronze');
                const isCurrent = profile.tier === tierName;

                return (
                  <div key={tierName} className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all mb-1 ${
                        isCurrent
                          ? 'bg-[#E5C78A] text-[#1F3A26] ring-4 ring-[#E5C78A]/30 scale-110'
                          : isPassedOrCurrent
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white/20 text-gray-300'
                      }`}
                    >
                      {isPassedOrCurrent && !isCurrent ? '✓' : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs font-bold truncate ${
                        isCurrent ? 'text-[#E5C78A]' : 'text-gray-300'
                      }`}
                    >
                      {tierName}
                    </span>
                    <span className="text-[9px] text-gray-400 hidden sm:block">
                      {TIER_CONFIG[tierName].minPoints}+ pts
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Continuous Tier Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#C9A66B] via-[#E5C78A] to-[#FFF0D0] rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${Math.max(6, profile.tierProgress)}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-[#E5E0D8] pt-1">
                <span>
                  {profile.tier === 'Platinum' ? (
                    <span className="text-[#E5C78A] font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Highest Elite Tier Achieved
                    </span>
                  ) : (
                    <>
                      Need{' '}
                      <span className="font-bold text-white text-sm underline decoration-[#E5C78A]">
                        {profile.pointsToNextTier.toLocaleString()} more points
                      </span>{' '}
                      to reach <span className="text-[#E5C78A] font-bold">{getNextTierName()}</span>
                    </>
                  )}
                </span>
                <span className="font-bold text-[#E5C78A]">{profile.tierProgress.toFixed(0)}% Progress</span>
              </div>
            </div>
          </div>

          {/* Active Tier Perks Quick Chips */}
          <div className="pt-1 flex flex-wrap gap-2 text-[11px]">
            {currentTierMeta.perks.slice(0, 3).map((perk, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#E5C78A] border border-white/10 backdrop-blur-xs font-medium"
              >
                <Check className="w-3 h-3 text-[#C9A66B]" />
                {perk}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIVE UNLOCKED VOUCHERS & SERVICE UPGRADES */}
      {unlockedRewards.length > 0 && (
        <div className="bg-[#FDF8EC] p-5 rounded-2xl border border-[#C9A66B]/40 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#C9A66B] text-white flex items-center justify-center shadow-xs">
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-[#1F3A26]">
                  Your Unlocked Vouchers &amp; Service Upgrades
                </h4>
                <p className="text-[11px] text-[#8C6D37]">
                  Ready to apply at checkout or present at salon reception
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white text-[#9E7A3E] border border-[#EADBBA]">
              {unlockedRewards.length} Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unlockedRewards.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-xl border border-[#EADBBA] shadow-xs flex flex-col justify-between space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#9E7A3E] tracking-wider block">
                      {item.type === 'service_upgrade'
                        ? 'Salon Upgrade'
                        : item.type === 'free_product'
                        ? 'Botanical Gift'
                        : 'Store Discount'}
                    </span>
                    <h5 className="font-bold text-xs text-[#1F3A26] line-clamp-1">{item.title}</h5>
                    <p className="text-[10px] text-gray-500 mt-0.5">Expires: {item.expiresAt}</p>
                  </div>
                  <span className="font-extrabold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                    {formatINR(item.valueINR)} Value
                  </span>
                </div>

                <div className="bg-[#FAF8F5] p-2 rounded-lg border border-dashed border-[#C9A66B]/50 flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-xs text-[#1F3A26] tracking-wider truncate">
                    {item.code}
                  </span>
                  <button
                    onClick={() => handleCopyCode(item.code)}
                    className="px-2.5 py-1 rounded-md bg-[#1F3A26] hover:bg-[#2D4D36] text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedCode === item.code ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-[#E5C78A]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-[#E5C78A]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* REWARDS CATALOG SECTION */}
      {/* ========================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-heading text-lg font-bold text-[#1F3A26] flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#C9A66B]" />
              <span>Rewards Catalog</span>
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Redeem your Aura Points for instant store discounts, salon service upgrades, and botanical gifts.
            </p>
          </div>

          {/* Search Catalog */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Search rewards..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#FAF8F5] border border-gray-200 rounded-xl text-xs text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:border-[#1F3A26]"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Rewards', icon: Layers },
            { id: 'discounts', label: 'Store Discounts', icon: Tag },
            { id: 'services', label: 'Service Upgrades', icon: Scissors },
            { id: 'products', label: 'Botanical Gifts', icon: Package },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCatalogCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCatalogCategory(cat.id as RewardCategory)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#1F3A26] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E5C78A]' : 'text-[#C9A66B]'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Catalog Items Grid */}
        {filteredCatalog.length === 0 ? (
          <div className="text-center py-10 bg-[#FAF8F5] rounded-2xl border border-gray-200 p-6 space-y-2">
            <AlertCircle className="w-6 h-6 text-gray-400 mx-auto" />
            <p className="text-xs font-bold text-gray-600">No matching rewards found.</p>
            <button
              onClick={() => {
                setActiveCatalogCategory('all');
                setCatalogSearch('');
              }}
              className="text-xs text-[#1F3A26] font-bold underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredCatalog.map((reward) => {
              const canAfford = profile.pointsBalance >= reward.requiredPoints;
              const isRedeeming = redeemingId === reward.id;

              return (
                <div
                  key={reward.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:border-[#1F3A26]/30 transition-all flex flex-col justify-between p-4 space-y-3.5"
                >
                  <div className="space-y-2">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FDF8EC] text-[#9E7A3E] font-bold text-[10px] border border-[#EADBBA]">
                        <Tag className="w-3 h-3 text-[#C9A66B]" />
                        {reward.requiredPoints} Aura Points
                      </span>

                      {reward.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1F3A26]/10 text-[#1F3A26]">
                          {reward.badge}
                        </span>
                      )}
                    </div>

                    {/* Title & Value */}
                    <div>
                      <h5 className="font-heading font-bold text-sm text-[#1F3A26] leading-snug">
                        {reward.title}
                      </h5>
                      <span className="text-[11px] font-bold text-emerald-700 block mt-0.5">
                        {formatINR(reward.valueINR)} Value Benefit
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                      {reward.description}
                    </p>

                    {/* Terms */}
                    {reward.terms && (
                      <p className="text-[10px] text-gray-400 italic">
                        {reward.terms}
                      </p>
                    )}
                  </div>

                  {/* Redeem Button */}
                  <div className="pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleRedeemCatalogReward(reward)}
                      disabled={!canAfford || isRedeeming}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                        canAfford
                          ? 'bg-[#1F3A26] hover:bg-[#2D4D36] text-white active:scale-98'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      }`}
                    >
                      {isRedeeming ? (
                        <span>Redeeming Reward...</span>
                      ) : canAfford ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#E5C78A]" />
                          <span>Redeem for {reward.requiredPoints} pts</span>
                        </>
                      ) : (
                        <span>Need {reward.requiredPoints - profile.pointsBalance} more pts</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Repeat Booking Incentive & Point Accelerators Banner */}
      <div className="bg-gradient-to-br from-[#FAF8F5] to-[#F3EEE5] p-5 rounded-2xl border border-[#1F3A26]/15 shadow-xs space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1F3A26]/10 text-[#1F3A26] text-[10px] font-bold tracking-wide uppercase">
              <Zap className="w-3 h-3 text-[#C9A66B]" />
              Accelerate Your Next Tier
            </div>
            <h4 className="font-heading font-bold text-base text-[#1F3A26]">
              Earn 200 Bonus Aura Points on Every Appointment
            </h4>
            <p className="text-xs text-[#6E6E6E] max-w-xl leading-relaxed">
              Book hair rituals, organic facials, or bridal packages to earn{' '}
              <span className="text-[#1F3A26] font-bold">10 pts for every ₹100</span> + an instant{' '}
              <span className="text-[#1F3A26] font-bold">200 pts booking bonus</span>!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {onOpenBooking && (
            <button
              onClick={onOpenBooking}
              className="px-4 py-2.5 rounded-xl bg-[#1F3A26] hover:bg-[#2D4D36] text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>Book Appointment (+200 pts)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {onNavigateToShop && (
            <button
              onClick={onNavigateToShop}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-[#1F3A26] font-bold text-xs flex items-center gap-2 transition-all border border-gray-200 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>Shop Botanical Care</span>
            </button>
          )}
        </div>
      </div>

      {/* Tier Comparison Switcher */}
      <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#1F3A26]/10 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-xs font-bold text-[#1F3A26] uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#C9A66B]" />
            <span>Serenity Membership Tiers &amp; Multipliers</span>
          </h4>
          <span className="text-[11px] text-gray-500">10 pts per ₹100 spent</span>
        </div>

        {/* Tier Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {tiersList.map((t) => {
            const isCurrent = profile.tier === t;
            const isSelected = selectedTierDetail === t;
            const meta = TIER_CONFIG[t];

            return (
              <button
                key={t}
                onClick={() => setSelectedTierDetail(t)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-white border-[#1F3A26] shadow-sm ring-2 ring-[#1F3A26]/10'
                    : 'bg-white/60 border-gray-200 hover:bg-white'
                }`}
              >
                {isCurrent && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                )}
                <span className="text-[10px] font-bold text-gray-400 block uppercase">{t}</span>
                <span className="font-heading font-bold text-xs text-[#1F3A26] block truncate">
                  {meta.minPoints}+ pts
                </span>
                <span className="text-[10px] text-[#C9A66B] font-semibold">{meta.multiplier}x Multiplier</span>
              </button>
            );
          })}
        </div>

        {/* Selected Tier Perks Card */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-2">
          <div className="flex items-center justify-between">
            <h5 className="font-heading font-bold text-sm text-[#1F3A26] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A66B]" />
              <span>{TIER_CONFIG[selectedTierDetail].name} Perks</span>
            </h5>
            {profile.tier === selectedTierDetail ? (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Current Active Status
              </span>
            ) : (
              <span className="text-[11px] font-medium text-gray-500">
                {TIER_CONFIG[selectedTierDetail].minPoints}+ Points Required
              </span>
            )}
          </div>

          <ul className="space-y-1.5 pt-1 text-xs text-[#1A1A1A]">
            {TIER_CONFIG[selectedTierDetail].perks.map((perk, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#C9A66B] shrink-0 mt-0.5" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Points History Log */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-[#1F3A26] uppercase tracking-wider flex items-center gap-1.5">
          <History className="w-4 h-4 text-[#C9A66B]" />
          <span>Points Activity Log</span>
        </h4>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden divide-y divide-gray-100">
          {profile.history.map((item) => (
            <div key={item.id} className="p-3.5 sm:px-4 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-[#1A1A1A]">{item.title}</p>
                <p className="text-[10px] text-gray-400">{item.date}</p>
              </div>
              <span
                className={`font-bold font-heading text-sm ${
                  item.points > 0 ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                {item.points > 0 ? `+${item.points}` : item.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
