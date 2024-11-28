<!-- src/components/Terminal.vue -->
<template>
    <div class="terminal">
      <div v-for="(line, index) in output" :key="index">{{ line }}</div>
      <div class="prompt">
        <span class="user">{{ username }}</span>
        <span class="at">@</span>
        <span class="host">{{ hostname }}</span>
        <span class="colon">:</span>
        <span class="path">{{ currentPath }}</span>
        <span class="dollar">$</span>
        <input
          type="text"
          v-model="command"
          @keyup.enter="executeCommand"
          class="terminal-input"
          placeholder=""
          autofocus
        />
      </div>
      <div class="route-content">
        <router-view />
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
import { lsCommand } from './commands/ls';
import { cdCommand } from './commands/cd';
  
  const router = useRouter();
  const route = useRoute();
  
  const username = 'tglavina';
  const hostname = 'Satoru';
  const command = ref<string>('');
  const output = ref<string[]>([]);
  
  const currentPath = ref<string>('~');
  const isFirstVisit = ref<boolean>(true);
  
  // Function to "fake" clearing the terminal
  const clearTerminal = () => {
    router.push('/clear');
    setTimeout(() => {
      output.value = []; // Clear output to simulate a fresh start
      router.push('/');
    }, 100); // Delay to allow the /clear route to take effect
  };
  
  // Update the initial output based on the current route
  const updateInitialOutput = () => {
    if (isFirstVisit.value) {
      output.value.push(`${username}@${hostname}:${currentPath.value}$`);
      output.value.push('Welcome to Tomas\'s Portfolio!');
      output.value.push('Type a command: about, projects, skills, contact');
      isFirstVisit.value = false;
    }
  };
  
  watch(route, () => {
    currentPath.value = route.path === '/' ? '~' : `~${route.path}`;
    if (!isFirstVisit.value && route.name !== 'Clear') {
      output.value.push(`${username}@${hostname}:${currentPath.value}$`);
    }
  });
  
  // Function to execute the command
  const executeCommand = () => {
    const cmd = command.value.trim().split(' ');
    const mainCommand = cmd[0].toLowerCase();
    const arg = cmd[1];

    switch (mainCommand) {
      case 'about':
        router.push('/about');
        break;
      case 'projects':
        router.push('/projects');
        break;
      case 'skills':
        router.push('/skills');
        break;
      case 'contact':
        router.push('/contact');
        break;
      case 'home':
        router.push('/');
        break;
      case 'clear':
        clearTerminal();
        break;
      case 'ls': 
        const lsOutput = lsCommand(currentPath.value);
        output.value.push(`${username}@${hostname}:${currentPath.value}$ ${command.value}`);
        output.value.push(...lsOutput);
        break;
      case 'cd': 
        const cdOutput = cdCommand(router, currentPath.value, arg);
        if(cdOutput) {
          output.value.push(`${username}@${hostname}:${currentPath.value}$ ${command.value}`);
          output.value.push(cdOutput);
        }
        break;
      default:
        output.value.push(`${username}@${hostname}:${currentPath.value}$ ${command.value}`);
        output.value.push(`Unknown command: ${command.value}`);
    }
    command.value = '';
  };
  
  // Clear terminal and navigate to home on first load
  onMounted(() => {
    clearTerminal();
  });
  
  </script>
  
  <style scoped>
  .terminal {
    width: 95vw;
    height: 95vh ;
    margin: 0;
    padding: 0;
    
    font-size: 1.2em;
    line-height: 1.5;
    padding: 20px;
    background-color: #1d2021; /* Gruvbox dark background */
    color: #ebdbb2; /* Gruvbox light text */
    border-radius: 3px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  }
  
  .prompt {
    display: flex;
    align-items: center;
  }
  
  .user {
    color: #83a598; /* Gruvbox aqua */
  }
  
  .at {
    color: #d3869b; /* Gruvbox purple */
  }
  
  .host {
    color: #8ec07c; /* Gruvbox green */
  }
  
  .colon {
    color: #ebdbb2; /* Gruvbox light text */
  }
  
  .path {
    color: #fabd2f; /* Gruvbox yellow */
  }
  
  .dollar {
    color: #ebdbb2; /* Gruvbox light text */
    margin-right: 5px;
  }
  
  .terminal-input {
    background: transparent;
    border: none;
    color: #b8bb26; /* Gruvbox bright green */
    outline: none;
    font-family: inherit;
    font-size: inherit;
    width: 100%;
  }
  
  .route-content {
    margin-top: 10px;
  }
  
  .blinking-cursor {
    animation: blink 1s step-end infinite;
  }
  
  @keyframes blink {
    from, to {
      color: transparent;
    }
    50% {
      color: #b8bb26;
    }
  }
  </style>
  