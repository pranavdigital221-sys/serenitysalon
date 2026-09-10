import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Users,
  Gift,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Mail,
  RefreshCw,
  Award,
  Percent,
  CheckCircle2,
  Clock,
  TrendingUp,
  Coins,
} from 'lucide-react';
import { ReferralData } from '../../types';
import { getUserReferral, saveUserReferral } from '../../utils/accountData';
import { formatINR } from '../../utils/currency';

interface ReferAFriendProps {
  onCopySuccess?: (msg: string) => void;
  onPointsEarned?: (pts: number) => void;
  onNavigateToShop?: () => void;
}

export const ReferAFriend: React.FC<ReferAFriendProps> = ({
  onCopySuccess,
  onPointsEarned,
  onNavigateToShop,
}) => {
  const [referralData, setReferralData] = useState<ReferralData>(getUserReferral);
  const [copied, setCopied] = useState(false);
  const [friendNameInput, setFriendNameInput] = useState('');
  const [isSimulatingInvite, setIsSimulatingInvite] = useState(false);

  // Milestone: 5 referrals unlocks a free luxury spa ritual (worth ₹2,200)
  const milestoneTarget = 5;
  const milestoneProgress = Math.min(100, (referralData.successfulOrders / milestoneTarget) * 100);
  const referralsNeededForMilestone = Math.max(0, milestoneTarget - referralData.successfulOrders);

  // Total discounts earned calculation (₹500 voucher or 500 points per successful referral)
  const totalDiscountsEarnedINR = referralData.successfulOrders * 500;
  const pendingInvitesCount = Math.max(0, referralData.friendsInvited - referralData.successfulOrders);
  const potentialPendingDiscountsINR = pendingInvitesCount * 500;

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(referralData.referralLink);
      setCopied(true);
      if (onCopySuccess) {
        onCopySuccess('Unique referral link copied to clipboard!');
      }
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleRegenerateCode = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCode = `SERENITY-AURA-${randomSuffix}`;
    const newLink = `https://serenitysalon.in/invite?ref=${newCode}`;
    const updated: ReferralData = {
      ...referralData,
      referralCode: newCode,
      referralLink: newLink,
    };
    setReferralData(updated);
    saveUserReferral(updated);
    if (onCopySuccess) {
      onCopySuccess('Generated a brand new unique referral link!');
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hey! ✨ Treat yourself at Serenity Luxury Salon with my invite code *${referralData.referralCode}* to get *20% OFF* your first appointment or botanical order + 500 bonus points! 🌿\n\nClaim your reward here: ${referralData.referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('20% Off at Serenity Luxury Salon & Cosmetics');
    const body = encodeURIComponent(
      `Hey,\n\nI thought you'd love Serenity Salon! Use my personal invite code "${referralData.referralCode}" to get 20% off your first hair ritual, facial, or clean cosmetics order.\n\nClaim your reward here: ${referralData.referralLink}\n\nEnjoy!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleSimulateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendNameInput.trim()) return;

    setIsSimulatingInvite(true);
    setTimeout(() => {
      const todayStr = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(new Date());

      const newFriend = {
        id: `ref-${Date.now()}`,
        name: friendNameInput.trim(),
        status: 'Joined' as const,
        date: todayStr,
        rewardEarned: 0,
      };

      const updated: ReferralData = {
        ...referralData,
        friendsInvited: referralData.friendsInvited + 1,
        history: [newFriend, ...referralData.history],
      };

      setReferralData(updated);
      saveUserReferral(updated);
      setFriendNameInput('');
      setIsSimulatingInvite(false);

      if (onCopySuccess) {
        onCopySuccess(`VIP invitation sent to ${newFriend.name}! They get 20% OFF.`);
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Referral Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F3A26] via-[#2A4D35] to-[#142619] p-6 text-white shadow-lg border border-[#C9A66B]/30">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 rounded-full bg-[#C9A66B]/15 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C9A66B]/20 text-[#E5C78A] text-[11px] font-bold tracking-wide uppercase border border-[#C9A66B]/30">
              <Sparkles className="w-3 h-3" />
              Referral Rewards Program
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
              Give 20% OFF • Get ₹500 &amp; 500 Points
            </h3>
            <p className="text-xs text-[#E5E0D8] max-w-md leading-relaxed">
              Share your personal link with friends. They receive <span className="text-[#E5C78A] font-semibold">20% off</span> their first salon appointment or clean cosmetic order, and you earn <span className="text-[#E5C78A] font-semibold">₹500 in voucher discounts + 500 Aura Points</span> when they complete their first visit!
            </p>
          </div>

          <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-center w-full sm:w-44">
              <span className="text-[10px] uppercase font-bold text-gray-300 tracking-wider block">Discounts Earned</span>
              <span className="text-xl font-extrabold text-[#E5C78A] font-heading">
                {formatINR(totalDiscountsEarnedINR)}
              </span>
              <span className="text-[10px] text-gray-300 block mt-0.5">
                +{referralData.totalPointsEarned} Aura Points
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Rewards KPI Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
              Successful Referrals
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-[#1F3A26] font-heading">
                {referralData.successfulOrders}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                / {referralData.friendsInvited} Invited
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FDF8EC] text-[#9E7A3E] flex items-center justify-center shrink-0 border border-[#EADBBA]">
            <Award className="w-5 h-5 text-[#C9A66B]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
              Discounts Claimed
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-[#1F3A26] font-heading">
                {formatINR(totalDiscountsEarnedINR)}
              </span>
              <span className="text-xs text-emerald-700 font-semibold">
                (3 Vouchers)
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
              Pending Rewards
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-blue-700 font-heading">
                {formatINR(potentialPendingDiscountsINR)}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                ({pendingInvitesCount} Invites)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Milestone Incentive Progress Bar */}
      <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#1F3A26]/10 space-y-2.5">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#C9A66B]" />
            <span className="font-bold text-[#1F3A26]">Milestone Reward: FREE Luxury Hair Spa Ritual</span>
          </div>
          <span className="text-[11px] font-bold text-[#C9A66B] bg-[#FDF8EC] px-2.5 py-0.5 rounded-full border border-[#EADBBA]">
            {referralsNeededForMilestone === 0
              ? '🎉 Milestone Achieved! Voucher Ready'
              : `${referralsNeededForMilestone} more referral${referralsNeededForMilestone > 1 ? 's' : ''} needed`}
          </span>
        </div>

        <div className="space-y-1">
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#1F3A26] via-[#C9A66B] to-[#E5C78A] rounded-full transition-all duration-500"
              style={{ width: `${Math.max(8, milestoneProgress)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-gray-500 pt-0.5">
            <span>{referralData.successfulOrders} Friends Completed</span>
            <span className="font-semibold text-[#1F3A26]">Goal: 5 Referrals (Worth ₹2,200)</span>
          </div>
        </div>
      </div>

      {/* Unique Link & Code Generator */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-[#C9A66B]" /> Your Personal Referral Link
            </span>
            <button
              onClick={handleRegenerateCode}
              className="text-[11px] text-[#C9A66B] hover:text-[#9E7A3E] font-medium flex items-center gap-1 cursor-pointer transition-colors"
              title="Generate new custom link code"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Regenerate Link</span>
            </button>
          </label>
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                readOnly
                value={referralData.referralLink}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] text-xs font-mono text-[#1F3A26] border border-gray-200 select-all focus:outline-none focus:border-[#C9A66B] shadow-inner"
              />
              <div className="absolute right-3 top-2.5 text-[10px] font-bold text-[#C9A66B] bg-[#FDF8EC] px-2 py-0.5 rounded border border-[#EADBBA]">
                {referralData.referralCode}
              </div>
            </div>
            <button
              onClick={handleCopyLink}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                copied
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#1F3A26] hover:bg-[#2D4D36] text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#C9A66B]" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#C9A66B]" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Share Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold text-[#6E6E6E]">Share directly via:</span>
          
          <button
            onClick={handleWhatsAppShare}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-xs font-bold transition-colors cursor-pointer border border-[#25D366]/30"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Invite</span>
          </button>

          <button
            onClick={handleEmailShare}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F3A26]/5 hover:bg-[#1F3A26]/10 text-[#1F3A26] text-xs font-bold transition-colors cursor-pointer border border-[#1F3A26]/15"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Invite</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A66B]/15 hover:bg-[#C9A66B]/25 text-[#9E7A3E] text-xs font-bold transition-colors cursor-pointer border border-[#C9A66B]/30"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy Message</span>
          </button>
        </div>
      </div>

      {/* How it works 3-step guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#1F3A26] flex items-center justify-center font-bold text-xs border border-[#1F3A26]/10">
            1
          </div>
          <h4 className="text-xs font-bold text-[#1F3A26]">Invite Friends</h4>
          <p className="text-[11px] text-[#6E6E6E] leading-relaxed">
            Share your unique referral link via WhatsApp, Instagram DM, or email with friends.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FDF8EC] text-[#C9A66B] flex items-center justify-center font-bold text-xs border border-[#C9A66B]/30">
            2
          </div>
          <h4 className="text-xs font-bold text-[#1F3A26]">Friend Gets 20% OFF</h4>
          <p className="text-[11px] text-[#6E6E6E] leading-relaxed">
            They instantly save 20% on their first salon booking or clean botanical order.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-[#EDF4EF] text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">
            3
          </div>
          <h4 className="text-xs font-bold text-[#1F3A26]">Get ₹500 + 500 Points</h4>
          <p className="text-[11px] text-[#6E6E6E] leading-relaxed">
            You automatically receive ₹500 in voucher credit and 500 Aura Points per completed visit.
          </p>
        </div>
      </div>

      {/* Invite by Email / Name direct form */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <h4 className="text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Gift className="w-4 h-4 text-[#C9A66B]" />
          <span>Send Instant 20% VIP Invite</span>
        </h4>
        <form onSubmit={handleSimulateInvite} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Friend's Full Name or Email (e.g. Tanya Mehta / tanya@gmail.com)"
            value={friendNameInput}
            onChange={(e) => setFriendNameInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF8F5] text-xs text-[#1A1A1A] border border-gray-200 focus:outline-none focus:border-[#C9A66B]"
          />
          <button
            type="submit"
            disabled={isSimulatingInvite || !friendNameInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-[#1F3A26] hover:bg-[#2D4D36] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <span>{isSimulatingInvite ? 'Sending...' : 'Send 20% Invite'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B]" />
          </button>
        </form>
      </div>

      {/* Referral Activity / Friends History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#1F3A26] uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#C9A66B]" />
            <span>Referral Activity History ({referralData.friendsInvited} Invited • {referralData.successfulOrders} Completed)</span>
          </h4>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden divide-y divide-gray-100">
          {referralData.history.map((friend) => (
            <div key={friend.id} className="p-3.5 sm:px-4 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#1F3A26] font-bold flex items-center justify-center border border-gray-200 text-[11px]">
                  {friend.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-[#1A1A1A]">{friend.name}</p>
                  <p className="text-[10px] text-gray-400">Invited on {friend.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {friend.status === 'Reward Credited' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
                    <Award className="w-3 h-3 text-[#C9A66B]" />
                    ₹500 Voucher + 500 Pts Credited
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold text-[10px] border border-amber-200">
                    Invite Active • Pending 1st Order
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

