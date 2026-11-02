<script setup lang="ts">
import { computed, ref } from 'vue'
import type { User } from '@/types/user'

const props = defineProps<{ user: User }>()

// v-show: показати/приховати details
const isDetailsOpen = ref(false)

const fullName = computed(() => `${props.user.name.title}. ${props.user.name.first} ${props.user.name.last}`)
const plainName = computed(() => `${props.user.name.title} ${props.user.name.first} ${props.user.name.last}`)
const altText = computed(() => `${props.user.name.first} ${props.user.name.last}`)
const genderLabel = computed(() => (props.user.gender === 'female' ? 'Female' : 'Male'))
const birthDate = computed(() =>
  new Date(props.user.dob.date).toLocaleDateString('uk-UA', { timeZone: 'UTC' }),
)

// Об'єктний синтаксис :class — клас додається, коли значення true
const ageClasses = computed(() => {
  const age = props.user.dob.age
  return {
    minor: age < 18,
    young: age >= 18 && age <= 30,
    adult: age > 30 && age <= 50,
    senior: age > 50,
  }
})

const HOBBY_ICONS: Record<string, string> = {
  Travel: '✈️', Photography: '📷', Hiking: '🥾', Reading: '📖', Cooking: '🍳', Music: '🎵',
  Gaming: '🎮', Cycling: '🚴', Painting: '🎨', Chess: '♟️',
}
const hobbyIcon = (hobby: string): string => HOBBY_ICONS[hobby] ?? '⭐'
</script>

<template>
  <article class="user-card" :class="ageClasses">
    <aside class="user-card__side">
      <img class="user-card__photo" :src="user.picture" :alt="altText" />
      <h2 class="user-card__name">{{ fullName }}</h2>

      <p class="user-card__meta">
        <span>⚥ {{ genderLabel }}</span>
        <!-- v-if: вік показуємо лише якщо більше 18 -->
        <span v-if="user.dob.age > 18">📅 {{ user.dob.age }} years</span>
      </p>

      <ul class="user-card__contacts">
        <li>📍 {{ user.location.city }}, {{ user.location.state }}, {{ user.location.country }}</li>
        <li>✉️ {{ user.email }}</li>
        <li>📞 {{ user.phone }}</li>
        <li>📱 {{ user.cell }}</li>
      </ul>
    </aside>

    <section class="user-card__main">
      <button class="about" type="button" :aria-expanded="isDetailsOpen" @click="isDetailsOpen = !isDetailsOpen">
        <span>👤 About me</span>
        <span class="about__chevron" :class="{ 'about__chevron--open': isDetailsOpen }">⌄</span>
      </button>
      <p v-show="isDetailsOpen" class="about__text">{{ user.details }}</p>

      <div class="panel">
        <h3 class="panel__title">📄 Personal Information</h3>
        <dl class="panel__list">
          <dt>Full name</dt><dd>{{ plainName }}</dd>
          <dt>Gender</dt><dd>{{ genderLabel }}</dd>
          <dt>Date of birth</dt>
          <dd>{{ birthDate }}<span v-if="user.dob.age > 18"> (age {{ user.dob.age }})</span></dd>
          <dt>Email</dt><dd>{{ user.email }}</dd>
          <dt>Phone</dt><dd>{{ user.phone }}</dd>
          <dt>Cell</dt><dd>{{ user.cell }}</dd>
        </dl>

        <h3 class="panel__title">📍 Location</h3>
        <dl class="panel__list">
          <dt>Street</dt><dd>{{ user.location.street.number }} {{ user.location.street.name }}</dd>
          <dt>City</dt><dd>{{ user.location.city }}</dd>
          <dt>State</dt><dd>{{ user.location.state }}</dd>
          <dt>Country</dt><dd>{{ user.location.country }}</dd>
          <dt>Postcode</dt><dd>{{ user.location.postcode }}</dd>
          <dt>Timezone</dt><dd>{{ user.location.timezone.offset }} ({{ user.location.timezone.description }})</dd>
        </dl>

        <h3 class="panel__title">⭐ Hobbies</h3>
        <ul class="hobbies">
          <!-- v-for + обов'язковий :key -->
          <li v-for="hobby in user.hobbies" :key="hobby" class="hobby" :class="`hobby--${hobby.toLowerCase()}`">
            {{ hobbyIcon(hobby) }} {{ hobby }}
          </li>
        </ul>
      </div>
    </section>
  </article>
</template>

<style scoped>
.user-card {
  --accent: #64748b;
  --tint: #ffffff;
  display: grid;
  grid-template-columns: 300px 1fr;
  background: #fff;
  border-radius: 16px;
  border-top: 6px solid var(--accent);
  box-shadow: 0 6px 24px rgba(27, 37, 89, 0.08);
  overflow: hidden;
}
/* Колір картки залежно від віку */
.user-card.minor { --accent: #f59e0b; --tint: #fffbeb; }
.user-card.young { --accent: #22c55e; --tint: #f0fdf4; }
.user-card.adult { --accent: #3b82f6; --tint: #eff6ff; }
.user-card.senior { --accent: #a855f7; --tint: #faf5ff; }

.user-card__side { padding: 24px; background: var(--tint); }
.user-card__photo { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 14px; }
.user-card__name { margin: 16px 0 8px; font-size: 1.4rem; }
.user-card__meta { display: flex; gap: 16px; margin: 0 0 12px; color: #475569; }
.user-card__contacts { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; font-size: 0.9rem; word-break: break-all; }

.user-card__main { padding: 20px; }
.about {
  width: 100%; display: flex; justify-content: space-between; align-items: center;
  padding: 12px 16px; border: 0; border-radius: 12px; background: #f1f5fd;
  font: inherit; font-weight: 600; cursor: pointer; color: inherit;
}
.about__chevron { transition: transform 0.2s; }
.about__chevron--open { transform: rotate(180deg); }
.about__text { margin: 10px 4px 0; color: #475569; }

.panel { margin-top: 16px; border: 1px solid #e5e9f5; border-radius: 12px; padding: 8px 16px 16px; }
.panel__title { margin: 16px 0 8px; font-size: 1.05rem; }
.panel__list { display: grid; grid-template-columns: 140px 1fr; gap: 6px 12px; margin: 0; font-size: 0.92rem; }
.panel__list dt { color: #64748b; }
.panel__list dd { margin: 0; }

.hobbies { display: flex; flex-wrap: wrap; gap: 8px; list-style: none; margin: 0; padding: 0; }
.hobby { padding: 6px 14px; border-radius: 999px; font-size: 0.85rem; background: #e2e8f0; color: #334155; }
.hobby--travel { background: #e0f2fe; color: #0369a1; }
.hobby--photography { background: #ede9fe; color: #6d28d9; }
.hobby--hiking { background: #dcfce7; color: #15803d; }
.hobby--reading { background: #fef3c7; color: #b45309; }
.hobby--cooking { background: #ffe4e6; color: #be123c; }
.hobby--music { background: #dbeafe; color: #1d4ed8; }

@media (max-width: 720px) {
  .user-card { grid-template-columns: 1fr; }
  .panel__list { grid-template-columns: 110px 1fr; }
}
</style>
