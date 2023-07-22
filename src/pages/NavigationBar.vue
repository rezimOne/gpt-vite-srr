<template>
  <nav class="vertical-nav-bar">
    <ul>
      <li v-for="(item, index) in navItems" :key="index" @mouseover="handleMouseOver(index)">
        <a :href="item.href" @mouseleave="handleMouseLeave(index)">
          <span>{{ item.title }}</span>
          <div class="hover-effect" :class="{ active: isActive(index) }" />
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const navItems = ref([
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Chat', href: '/chat' },
    { title: 'Custom component', href: '/custom-component' },
  ]);

  const activeIndex = ref(-1);

  const handleMouseOver = (index: number) => {
    activeIndex.value = index;
  };

  const handleMouseLeave = (index: number) => {
    activeIndex.value = -1;
  };

  const isActive = (index: number) => {
    return activeIndex.value === index;
  };
</script>

<style scoped lang="scss">
.vertical-nav-bar {
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  li {

    a {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #fff;
      position: relative;
      transition: color 0.3s;

      &:hover {
        color: #ff5c5c;
      }

      span {
        margin: 0 12px;
      }
      &.active {
        transform: scaleX(1);
      }
    }
  }
}
</style>