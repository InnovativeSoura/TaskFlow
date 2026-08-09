/* =========================================================
   TASKFLOW SETTINGS
   Premium settings page
   ========================================================= */

.settings-page {
  --settings-purple: #7657ff;
  --settings-purple-dark: #6242ee;
  --settings-purple-soft: #eeeaff;

  position: relative;
  min-height: calc(100vh - 70px);
  width: 100%;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 10% 15%,
      rgba(123, 92, 255, 0.13),
      transparent 30%
    ),
    radial-gradient(
      circle at 90% 20%,
      rgba(91, 144, 255, 0.11),
      transparent 30%
    ),
    radial-gradient(
      circle at 50% 90%,
      rgba(137, 92, 255, 0.10),
      transparent 32%
    ),
    #f8f9ff;
  color: #17213d;
}

/* =========================================================
   ANIMATED BACKGROUND
   ========================================================= */

.settings-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.settings-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(3px);
  opacity: 0.8;
  animation: settingsFloat 13s ease-in-out infinite;
}

.settings-orb-one {
  width: 260px;
  height: 260px;
  left: -90px;
  top: 40px;
  background: radial-gradient(
    circle,
    rgba(126, 87, 255, 0.23) 0%,
    rgba(126, 87, 255, 0.08) 48%,
    transparent 72%
  );
}

.settings-orb-two {
  width: 350px;
  height: 350px;
  right: -120px;
  top: 60px;
  background: radial-gradient(
    circle,
    rgba(73, 130, 255, 0.18) 0%,
    rgba(73, 130, 255, 0.06) 48%,
    transparent 72%
  );
  animation-delay: -4s;
}

.settings-orb-three {
  width: 300px;
  height: 300px;
  left: 45%;
  bottom: -150px;
  background: radial-gradient(
    circle,
    rgba(133, 83, 255, 0.14) 0%,
    rgba(133, 83, 255, 0.05) 50%,
    transparent 72%
  );
  animation-delay: -8s;
}

.settings-ring {
  position: absolute;
  border: 1px solid rgba(116, 91, 255, 0.12);
  border-radius: 50%;
  animation: settingsRotate 28s linear infinite;
}

.settings-ring-one {
  width: 330px;
  height: 330px;
  right: -120px;
  top: -70px;
}

.settings-ring-two {
  width: 250px;
  height: 250px;
  left: -120px;
  bottom: -90px;
  animation-direction: reverse;
  animation-duration: 34s;
}

.settings-grid-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.16;
  background-image:
    linear-gradient(
      rgba(109, 91, 220, 0.07) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(109, 91, 220, 0.07) 1px,
      transparent 1px
    );
  background-size: 46px 46px;
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.5),
    transparent 75%
  );
}

@keyframes settingsFloat {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  50% {
    transform: translate3d(20px, -18px, 0) scale(1.05);
  }
}

@keyframes settingsRotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* =========================================================
   MAIN
   ========================================================= */

.settings-main {
  position: relative;
  z-index: 1;
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
  padding: 42px 0 60px;
}

/* =========================================================
   HEADER
   ========================================================= */

.settings-page-header {
  margin-bottom: 26px;
}

.settings-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 9px;
  color: #7e8aa7;
  font-size: 10px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: 2px;
}

.settings-breadcrumb svg {
  width: 8px;
  height: 8px;
  color: #a69aff;
}

.settings-page-header h1 {
  margin: 0;
  color: #17213d;
  font-size: clamp(38px, 4vw, 54px);
  line-height: 1;
  font-weight: 900;
  letter-spacing: -2.5px;
}

.settings-page-header p {
  margin: 10px 0 0;
  color: #8290ac;
  font-size: 14px;
  font-weight: 500;
}

/* =========================================================
   MAIN SETTINGS PANEL
   ========================================================= */

.settings-panel {
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
  min-height: 570px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.95);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow:
    0 28px 80px rgba(49, 54, 100, 0.12),
    0 8px 30px rgba(77, 66, 150, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
}

/* =========================================================
   LEFT SETTINGS NAVIGATION
   ========================================================= */

.settings-panel-sidebar {
  display: flex;
  flex-direction: column;
  padding: 26px 16px 18px;
  border-right: 1px solid #edf0f8;
  background:
    linear-gradient(
      180deg,
      rgba(247, 248, 253, 0.96),
      rgba(242, 244, 251, 0.76)
    );
}

.settings-panel-label {
  padding: 0 12px 16px;
  color: #8994ad;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.8px;
}

.settings-navigation {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.settings-nav-item {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 64px;
  padding: 9px 10px;
  gap: 11px;
  border: 1px solid transparent;
  border-radius: 13px;
  background: transparent;
  color: #26314b;
  text-align: left;
  cursor: pointer;
  transition:
    background 0.22s ease,
    border-color 0.22s ease,
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

.settings-nav-item:hover {
  transform: translateX(2px);
  border-color: #e5ddff;
  background: rgba(255, 255, 255, 0.7);
}

.settings-nav-item.is-active {
  border-color: #dcd1ff;
  background:
    linear-gradient(
      135deg,
      rgba(239, 234, 255, 0.98),
      rgba(249, 247, 255, 0.92)
    );
  box-shadow:
    0 10px 24px rgba(111, 77, 238, 0.10);
}

.settings-nav-item.is-active::before {
  content: "";
  position: absolute;
  left: -1px;
  top: 11px;
  bottom: 11px;
  width: 3px;
  border-radius: 0 5px 5px 0;
  background: linear-gradient(
    180deg,
    #8b69ff,
    #6541ef
  );
}

.settings-nav-icon {
  display: grid;
  place-items: center;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #e8ebf3;
  color: #7b88a4;
  transition: all 0.22s ease;
}

.settings-nav-icon svg {
  width: 15px;
  height: 15px;
}

.settings-nav-item.is-active .settings-nav-icon {
  background: linear-gradient(
    135deg,
    #8362ff,
    #6c47f4
  );
  color: white;
  box-shadow: 0 8px 18px rgba(112, 73, 245, 0.25);
}

.settings-nav-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.settings-nav-copy strong {
  color: #25304b;
  font-size: 12px;
  font-weight: 800;
}

.settings-nav-copy small {
  margin-top: 3px;
  overflow: hidden;
  color: #919bb0;
  font-size: 9px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.settings-nav-item.is-active .settings-nav-copy strong {
  color: #6743ed;
}

.settings-nav-arrow {
  width: 8px;
  height: 8px;
  color: #a5aec0;
}

.settings-nav-item.is-active .settings-nav-arrow {
  color: #744ff2;
}

/* =========================================================
   SIDEBAR SECURITY
   ========================================================= */

.settings-sidebar-security {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: auto;
  padding: 13px 11px;
  border: 1px solid #e1d9ff;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(239, 235, 255, 0.88),
    rgba(255, 255, 255, 0.88)
  );
}

.settings-sidebar-security-icon {
  display: grid;
  place-items: center;
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  background: #e8e0ff;
  color: #7550ef;
}

.settings-sidebar-security-icon svg {
  width: 12px;
  height: 12px;
}

.settings-sidebar-security div {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.settings-sidebar-security strong {
  color: #36405a;
  font-size: 9px;
  font-weight: 800;
}

.settings-sidebar-security span {
  margin-top: 2px;
  color: #929bb0;
  font-size: 7px;
  line-height: 1.3;
}

.settings-sidebar-security > svg {
  width: 9px;
  height: 9px;
  color: #15c783;
}

/* =========================================================
   CONTENT
   ========================================================= */

.settings-panel-content {
  min-width: 0;
  background: rgba(255, 255, 255, 0.76);
}

.settings-content-section {
  min-height: 100%;
  padding: 34px 38px 36px;
}

.settings-section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.settings-eyebrow {
  display: block;
  margin-bottom: 8px;
  color: #7650f3;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.7px;
}

.settings-section-heading h2 {
  margin: 0;
  color: #1b2641;
  font-size: clamp(26px, 2.4vw, 34px);
  line-height: 1.08;
  font-weight: 900;
  letter-spacing: -1.3px;
}

.settings-section-heading p {
  margin: 8px 0 0;
  color: #8b96ad;
  font-size: 12px;
  font-weight: 500;
}

.settings-heading-icon {
  display: grid;
  place-items: center;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background: #eeeaff;
  color: #7650f3;
  box-shadow: 0 8px 22px rgba(114, 78, 241, 0.10);
}

.settings-heading-icon svg {
  width: 15px;
  height: 15px;
}

.settings-divider {
  width: 100%;
  height: 1px;
  margin: 21px 0 17px;
  background: #eceef5;
}

/* =========================================================
   ACCOUNT
   ========================================================= */

.settings-profile-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 17px 18px;
  border: 1px solid #e8eaf2;
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 8px 22px rgba(42, 48, 85, 0.04);
}

.settings-profile-left {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;
}

.settings-large-avatar {
  display: grid;
  place-items: center;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background:
    linear-gradient(
      135deg,
      #8461ff,
      #6942ed
    );
  color: white;
  font-size: 15px;
  font-weight: 900;
  box-shadow:
    0 9px 22px rgba(109, 69, 241, 0.26);
}

.settings-profile-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.settings-profile-copy strong {
  color: #1e2943;
  font-size: 14px;
  font-weight: 850;
}

.settings-profile-copy span {
  margin-top: 4px;
  overflow: hidden;
  color: #8c96aa;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.settings-role-badge {
  padding: 6px 9px;
  border-radius: 6px;
  background: #f0ebff;
  color: #6e48ee;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.7px;
}

.settings-info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 11px;
}

.settings-info-card {
  display: flex;
  align-items: center;
  min-height: 69px;
  gap: 10px;
  padding: 12px;
  border: 1px solid #e9ebf3;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.82);
}

.settings-info-icon {
  display: grid;
  place-items: center;
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  border-radius: 8px;
}

.settings-info-icon svg {
  width: 11px;
  height: 11px;
}

.settings-info-icon.purple {
  background: #eeeaff;
  color: #7650f3;
}

.settings-info-icon.blue {
  background: #eaf3ff;
  color: #528df3;
}

.settings-info-icon.slate {
  background: #edf0f6;
  color: #71809e;
}

.settings-info-icon.green {
  background: #e6fbf2;
  color: #16b879;
}

.settings-info-card > div:last-child {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.settings-info-card span {
  color: #9aa3b6;
  font-size: 7px;
  font-weight: 900;
  letter-spacing: 1px;
}

.settings-info-card strong {
  margin-top: 5px;
  overflow: hidden;
  color: #2a3550;
  font-size: 10px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.settings-active-status {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #13ad72 !important;
}

.settings-active-status i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #18c786;
  box-shadow: 0 0 0 3px rgba(24, 199, 134, 0.12);
}

/* =========================================================
   PROTECTED BOX
   ========================================================= */

.settings-protected-box {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 12px;
  padding: 12px 14px;
  border: 1px solid #e3dcff;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    rgba(244, 241, 255, 0.94),
    rgba(255, 255, 255, 0.94)
  );
}

.settings-protected-icon {
  display: grid;
  place-items: center;
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: #e9e2ff;
  color: #7350ef;
}

.settings-protected-icon svg {
  width: 11px;
  height: 11px;
}

.settings-protected-box > div:nth-child(2) {
  min-width: 0;
  flex: 1;
}

.settings-protected-box strong {
  display: block;
  color: #34405a;
  font-size: 9px;
  font-weight: 850;
}

.settings-protected-box p {
  margin: 3px 0 0;
  color: #929caf;
  font-size: 7px;
  line-height: 1.4;
}

.settings-protected-check {
  flex: 0 0 auto;
  width: 10px;
  height: 10px;
  color: #15c783;
}

/* =========================================================
   APPEARANCE
   ========================================================= */

.settings-option-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.settings-option-card {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 74px;
  gap: 13px;
  padding: 12px 14px;
  border: 1px solid #e8eaf2;
  border-radius: 12px;
  background: white;
  text-align: left;
  cursor: pointer;
  transition: all 0.22s ease;
}

.settings-option-card:hover {
  border-color: #d9ceff;
  transform: translateY(-1px);
}

.settings-option-card.is-selected {
  border-color: #cfc0ff;
  background: #faf8ff;
  box-shadow: 0 8px 20px rgba(105, 72, 231, 0.08);
}

.settings-option-icon {
  display: grid;
  place-items: center;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #eeeaff;
  color: #7450ef;
}

.settings-option-icon svg {
  width: 14px;
  height: 14px;
}

.settings-option-copy {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.settings-option-copy strong {
  color: #27324b;
  font-size: 12px;
  font-weight: 850;
}

.settings-option-copy span {
  margin-top: 4px;
  color: #919bae;
  font-size: 9px;
}

.settings-radio {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border: 2px solid #d9deea;
  border-radius: 50%;
}

.settings-radio.is-selected {
  border-color: #7650f3;
}

.settings-radio span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #7650f3;
}

/* =========================================================
   NOTIFICATIONS
   ========================================================= */

.settings-notification-list {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.settings-notification-row {
  display: flex;
  align-items: center;
  min-height: 70px;
  gap: 13px;
  padding: 11px 13px;
  border: 1px solid #e8eaf1;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.22s ease;
}

.settings-notification-row:hover {
  border-color: #d9d1fa;
  transform: translateY(-1px);
}

.settings-notification-icon {
  display: grid;
  place-items: center;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #f0ebff;
  color: #7650f3;
}

.settings-notification-icon svg {
  width: 13px;
  height: 13px;
}

.settings-notification-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.settings-notification-copy strong {
  color: #2a3550;
  font-size: 11px;
  font-weight: 850;
}

.settings-notification-copy span {
  margin-top: 4px;
  color: #929bae;
  font-size: 8px;
}

.settings-toggle {
  position: relative;
  flex: 0 0 40px;
  width: 40px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: #d9deea;
  cursor: pointer;
  transition: background 0.2s ease;
}

.settings-toggle.is-active {
  background: linear-gradient(
    90deg,
    #8260ff,
    #7049ef
  );
}

.settings-toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 6px rgba(36, 42, 68, 0.18);
  transition: transform 0.2s ease;
}

.settings-toggle.is-active .settings-toggle-thumb {
  transform: translateX(18px);
}

/* =========================================================
   SECURITY
   ========================================================= */

.settings-security-card {
  display: flex;
  align-items: center;
  min-height: 76px;
  gap: 13px;
  padding: 13px;
  margin-bottom: 10px;
  border: 1px solid #e8eaf2;
  border-radius: 12px;
  background: white;
}

.settings-security-icon {
  display: grid;
  place-items: center;
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #eeeaff;
  color: #7650f3;
}

.settings-security-icon svg {
  width: 14px;
  height: 14px;
}

.settings-security-copy {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.settings-security-copy strong {
  color: #29344d;
  font-size: 11px;
  font-weight: 850;
}

.settings-security-copy span {
  margin-top: 4px;
  color: #929bae;
  font-size: 8px;
}

.settings-secondary-button {
  padding: 9px 12px;
  border: 1px solid #ddd6f7;
  border-radius: 8px;
  background: #faf9ff;
  color: #704cf0;
  font-size: 8px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
}

.settings-secondary-button:hover {
  background: #f0ebff;
  border-color: #cfc1ff;
}

/* =========================================================
   APPLICATION
   ========================================================= */

.settings-app-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.settings-app-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 82px;
  padding: 15px;
  border: 1px solid #e8eaf2;
  border-radius: 12px;
  background: white;
}

.settings-app-card span {
  color: #9aa3b6;
  font-size: 7px;
  font-weight: 900;
  letter-spacing: 1px;
}

.settings-app-card strong {
  margin-top: 7px;
  color: #29344e;
  font-size: 12px;
  font-weight: 850;
}

/* =========================================================
   FOOTER
   ========================================================= */

.settings-footer-card {
  display: flex;
  align-items: center;
  min-height: 72px;
  margin-top: 14px;
  padding: 12px 16px;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow:
    0 14px 35px rgba(45, 49, 89, 0.07);
  backdrop-filter: blur(18px);
}

.settings-footer-icon {
  display: grid;
  place-items: center;
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #eeeaff;
  color: #7650f3;
}

.settings-footer-icon svg {
  width: 13px;
  height: 13px;
}

.settings-footer-copy {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.settings-footer-copy strong {
  color: #303a53;
  font-size: 10px;
  font-weight: 850;
}

.settings-footer-copy span {
  margin-top: 4px;
  color: #929bae;
  font-size: 8px;
}

.settings-footer-status {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 9px;
  border-radius: 7px;
  background: #e9faf3;
  color: #12a971;
  font-size: 8px;
  font-weight: 850;
}

.settings-footer-status svg {
  width: 8px;
  height: 8px;
}

.settings-active-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  color: #a2a9ba;
  font-size: 8px;
  font-weight: 600;
}

.settings-active-label svg {
  width: 9px;
  height: 9px;
  color: #8a71eb;
}

/* =========================================================
   RESPONSIVE
   ========================================================= */

@media (max-width: 1050px) {
  .settings-main {
    width: min(1000px, calc(100% - 32px));
  }

  .settings-panel {
    grid-template-columns: 235px minmax(0, 1fr);
  }

  .settings-content-section {
    padding: 30px;
  }
}

@media (max-width: 820px) {
  .settings-main {
    width: calc(100% - 24px);
    padding-top: 28px;
  }

  .settings-panel {
    grid-template-columns: 1fr;
  }

  .settings-panel-sidebar {
    border-right: 0;
    border-bottom: 1px solid #edf0f8;
  }

  .settings-navigation {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .settings-sidebar-security {
    margin-top: 16px;
  }

  .settings-content-section {
    padding: 26px 24px 28px;
  }
}

@media (max-width: 600px) {
  .settings-page {
    min-height: calc(100vh - 60px);
  }

  .settings-main {
    width: calc(100% - 16px);
    padding: 22px 0 35px;
  }

  .settings-page-header h1 {
    font-size: 40px;
    letter-spacing: -1.8px;
  }

  .settings-page-header p {
    font-size: 11px;
  }

  .settings-panel {
    border-radius: 17px;
  }

  .settings-panel-sidebar {
    padding: 18px 12px 14px;
  }

  .settings-navigation {
    grid-template-columns: 1fr;
  }

  .settings-nav-item {
    min-height: 58px;
  }

  .settings-content-section {
    padding: 23px 16px;
  }

  .settings-section-heading h2 {
    font-size: 27px;
  }

  .settings-info-grid,
  .settings-app-grid {
    grid-template-columns: 1fr;
  }

  .settings-profile-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .settings-footer-card {
    align-items: flex-start;
  }

  .settings-footer-status {
    display: none;
  }

  .settings-footer-copy span {
    line-height: 1.5;
  }
}

@media (prefers-reduced-motion: reduce) {
  .settings-orb,
  .settings-ring {
    animation: none;
  }

  .settings-nav-item,
  .settings-option-card,
  .settings-notification-row {
    transition: none;
  }
}