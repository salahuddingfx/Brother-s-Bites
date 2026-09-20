'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import AnimatedNumber from '@/components/common/AnimatedNumber';
import { GrandOpeningSkeleton } from '@/components/skeletons/SectionSkeletons';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

export default function GrandOpeningSection() {
  const [targetDate, setTargetDate] = useState<Date>(new Date('2026-09-18T16:00:00+06:00'));
  const [title, setTitle] = useState<string>('Grand Opening');
  const [description, setDescription] = useState<string>(
    "Join us at Marine Drive, Sonar Para Beach for the grand opening of Brother's Bites. Experience fresh signature bites, chilled drinks, and brotherhood by the sea."
  );
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });

  // Fetch settings if available
  useEffect(() => {
    setMounted(true);
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data.data?.grandOpening) {
          const go = data.data.grandOpening;
          if (go.isEnabled !== undefined) setIsEnabled(go.isEnabled);
          if (go.title) setTitle(go.title);
          if (go.description) setDescription(go.description);
          if (go.date) {
            const parsed = new Date(go.date);
            if (!isNaN(parsed.getTime())) {
              setTargetDate(parsed);
            }
          }
        }
      } catch {
        // use fallback default
      }
      if (mounted) setLoading(false);
    };
    fetchSettings();
  }, []);

  // Live countdown timer
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isComplete: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!isEnabled) return null;

  if (loading) {
    return (
      <section className="bg-brand-surface py-12 sm:py-16 border-y border-white/5">
        <div className="container-bb">
          <GrandOpeningSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-brand-surface py-12 sm:py-16 border-y border-white/5">
      <div className="container-bb">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="card-bb bg-gradient-to-br from-brand-surface-light via-brand-surface to-brand-surface-light p-6 sm:p-10 md:p-12 border-brand-yellow/30"
        >
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            {/* Launch Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 mb-4 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-yellow">
                {title}
              </span>
            </div>

            {/* Date Display */}
            <div className="mb-4">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-brand-cream/60 mb-1 flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4 text-brand-yellow" />
                <span>Opening Date</span>
              </p>
              <h2 className="heading-display text-brand-cream tracking-tight">
                {targetDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}{' '}
                <span className="text-brand-yellow">{targetDate.getFullYear()}</span>
              </h2>
            </div>

            {/* Live CountUp / Countdown Timer */}
            {mounted && (
              <div className="my-6 sm:my-8 w-full max-w-lg">
                {!timeLeft.isComplete ? (
                  <div className="grid grid-cols-4 gap-2 sm:gap-4">
                    <div className="card-bb p-3 sm:p-4 text-center bg-brand-black/60 border-brand-yellow/20">
                      <AnimatedNumber
                        value={timeLeft.days}
                        className="text-2xl sm:text-4xl font-extrabold text-brand-yellow font-mono tabular-nums block"
                      />
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-cream/50 block mt-1">
                        Days
                      </span>
                    </div>
                    <div className="card-bb p-3 sm:p-4 text-center bg-brand-black/60 border-brand-yellow/20">
                      <AnimatedNumber
                        value={timeLeft.hours}
                        className="text-2xl sm:text-4xl font-extrabold text-brand-yellow font-mono tabular-nums block"
                      />
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-cream/50 block mt-1">
                        Hours
                      </span>
                    </div>
                    <div className="card-bb p-3 sm:p-4 text-center bg-brand-black/60 border-brand-yellow/20">
                      <AnimatedNumber
                        value={timeLeft.minutes}
                        className="text-2xl sm:text-4xl font-extrabold text-brand-yellow font-mono tabular-nums block"
                      />
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-cream/50 block mt-1">
                        Minutes
                      </span>
                    </div>
                    <div className="card-bb p-3 sm:p-4 text-center bg-brand-black/60 border-brand-yellow/20">
                      <AnimatedNumber
                        value={timeLeft.seconds}
                        className="text-2xl sm:text-4xl font-extrabold text-brand-yellow font-mono tabular-nums block"
                      />
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-cream/50 block mt-1">
                        Seconds
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-brand-yellow/10 border border-brand-yellow/30 text-center">
                    <div className="inline-flex items-center gap-2 text-brand-yellow font-bold text-sm sm:text-base uppercase tracking-wider">
                      <Sparkles size={18} />
                      <span>We Are Officially Open!</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <p className="text-brand-cream/75 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-6 sm:mb-8">
              {description}
            </p>

            {/* Actions & Location Pin */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link href="/location" className="btn-primary w-full sm:w-auto gap-2">
                <span>GET DIRECTIONS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-brand-cream/60">
                <MapPin className="w-4 h-4 text-brand-yellow shrink-0" />
                <span>Marine Drive, Cox&apos;s Bazar</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
