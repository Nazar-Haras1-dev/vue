<script setup lang="ts">
import { computed, ref } from 'vue'
import usersData from '@/data/users.json'
import type { User } from '@/types/user'
import UserCard from '@/components/UserCard.vue'

type GenderFilter = 'all' | 'male' | 'female'
type AgeFilter = 'all' | 'adult'
type SortMode = 'default' | 'name-asc' | 'name-desc' | 'age-asc' | 'age-desc'

// Вихідний список ніколи не змінюється — працюємо з копіями
const users = ref<User[]>(usersData as User[])

const genderFilter = ref<GenderFilter>('all')
const ageFilter = ref<AgeFilter>('all')
const sortMode = ref<SortMode>('default')

const fullName = (u: User): string => `${u.name.first} ${u.name.last}`

// Спочатку фільтруємо, потім сортуємо — тому сортування не ламає фільтри
const visibleUsers = computed<User[]>(() => {
  const filtered = users.value.filter(
    (u) =>
      (genderFilter.value === 'all' || u.gender === genderFilter.value) &&
      (ageFilter.value === 'all' || u.dob.age >= 18),
  )
  switch (sortMode.value) {
    case 'name-asc': return filtered.sort((a, b) => fullName(a).localeCompare(fullName(b)))
    case 'name-desc': return filtered.sort((a, b) => fullName(b).localeCompare(fullName(a)))
    case 'age-asc': return filtered.sort((a, b) => a.dob.age - b.dob.age)
    case 'age-desc': return filtered.sort((a, b) => b.dob.age - a.dob.age)
    default: return filtered
  }
})

function resetAll(): void {
  genderFilter.value = 'all'
  ageFilter.value = 'all'
  sortMode.value = 'default'
}
</script>

<template>
  <section>
    <div class="toolbar">
      <div class="toolbar__group">
        <button type="button" :class="{ active: genderFilter === 'all' }" @click="genderFilter = 'all'">Всі</button>
        <button type="button" :class="{ active: genderFilter === 'male' }" @click="genderFilter = 'male'">Чоловіки</button>
        <button type="button" :class="{ active: genderFilter === 'female' }" @click="genderFilter = 'female'">Жінки</button>
      </div>

      <div class="toolbar__group">
        <button type="button" :class="{ active: ageFilter === 'all' }" @click="ageFilter = 'all'">Всі</button>
        <button type="button" :class="{ active: ageFilter === 'adult' }" @click="ageFilter = 'adult'">18 +</button>
      </div>

      <div class="toolbar__group">
        <button type="button" :class="{ active: sortMode === 'name-asc' }" @click="sortMode = 'name-asc'">Ім’я ↑</button>
        <button type="button" :class="{ active: sortMode === 'name-desc' }" @click="sortMode = 'name-desc'">Ім’я ↓</button>
        <button type="button" :class="{ active: sortMode === 'age-asc' }" @click="sortMode = 'age-asc'">Вік ↑</button>
        <button type="button" :class="{ active: sortMode === 'age-desc' }" @click="sortMode = 'age-desc'">Вік ↓</button>
      </div>

      <button type="button" class="toolbar__reset" @click="resetAll">Очистити все</button>
    </div>

    <p v-if="visibleUsers.length === 0" class="empty">Список юзерів пустий</p>
    <div v-else class="list">
      <UserCard v-for="user in visibleUsers" :key="user.id" :user="user" />
    </div>
  </section>
</template>

<style scoped>
.toolbar { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
.toolbar__group { display: flex; gap: 4px; padding: 4px; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(27, 37, 89, 0.06); }
button { padding: 8px 14px; border: 0; border-radius: 8px; background: transparent; font: inherit; cursor: pointer; color: inherit; }
button:hover { background: #eef2fb; }
button.active { background: #3b82f6; color: #fff; }
.toolbar__reset { background: #fee2e2; color: #b91c1c; }
.toolbar__reset:hover { background: #fecaca; }
.list { display: grid; gap: 20px; }
.empty { text-align: center; padding: 48px; color: #64748b; background: #fff; border-radius: 12px; }
</style>
