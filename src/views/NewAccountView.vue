<template>
  <v-container fluid fill-height class="new-account-page-background">
    <v-row align="center" justify="center" class="fill-height pt-16">
      <v-col cols="12" md="6" class="d-flex align-center justify-center">
        <v-card
          class="pa-12 pb-8 card-border-animation"
          elevation="15"
          max-width="438"
          rounded="lg"
          :style="{
            backgroundImage: `url(${BGLoginCard})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            color: 'white',
            backgroundColor: '#121212'
          }"
        >
          <div class="text-h5 text-center mb-6">Registrate</div>

          <div class="text-subtitle-1 text-medium-emphasis">Nombre de Usuario</div>
          <v-text-field
            density="compact"
            placeholder="Introduce tu nombre de usuario"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            v-model="username"
          ></v-text-field>

          <div class="text-subtitle-1 text-medium-emphasis">Correo Electrónico</div>
          <v-text-field
            density="compact"
            placeholder="Introduce tu dirección de correo"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            v-model="email"
          ></v-text-field>

          <div class="text-subtitle-1 text-medium-emphasis">Contraseña</div>
          <v-text-field
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            placeholder="Introduce tu contraseña"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            @click:append-inner="visible = !visible"
            v-model="password"
          ></v-text-field>

          <!-- ///////////////CAMPO QUE PERMITE CONFIRMAR LA CONTRASEÑA ////////////////-->
           
          <!-- <div class="text-subtitle-1 text-medium-emphasis">Confirmar Contraseña</div>
          <v-text-field
            :append-inner-icon="visibleConfirm ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visibleConfirm ? 'text' : 'password'"
            density="compact"
            placeholder="Confirma tu contraseña"
            prepend-inner-icon="mdi-lock-check-outline"
            variant="outlined"
            @click:append-inner="visibleConfirm = !visibleConfirm"
            v-model="confirmPassword"
          ></v-text-field>
        -->
          <v-btn
            class="mb-8 mt-4"
            color="blue"
            size="large"
            variant="tonal"
            block
            @click="createAccount"
          >
            REGISTRARSE
          </v-btn>

          <v-card-text class="text-center">
            <a
              class="text-blue text-decoration-none"
              href="#"
              rel="noopener noreferrer"
              target="_blank"
              @click.prevent="goToLogin"
            >
              ¿Ya estas registrado? Inicia Sesión <v-icon icon="mdi-chevron-right"></v-icon>
            </a>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const visible = ref(false); // Muestra y oculta la contraseña
//const visibleConfirm = ref(false);  -------- NO SE USA EL CAMPO DE CONFIRMACIÓN

/*
-----------------Aqui va donde se guarda la información de la cuenta
const createAccount = () => {
  if (password.value !== confirmPassword.value) {
    alert('Las contraseñas no coinciden.');
    return;
  }
  console.log('Crear cuenta con:', {
    username: username.value,
    email: email.value,
    password: password.value
  });
};
*/

const goToLogin = () => {
  router.push('/');
};
</script>

<style scoped>
.new-account-page-background {
  background-color: transparent !important;
}

.v-row.fill-height {
  height: 100%;
}

.card-border-animation {
  border: 2px solid;
  border-image-slice: 1;
  animation: blue-flicker 2s linear infinite;
}

@keyframes blue-flicker {
  0%, 100% {
    border-image-source: linear-gradient(to right, #72c9e6, #1E90FF, #5073db, #00BFFF);
  }
  50% {
    border-image-source: linear-gradient(to right, transparent, transparent, transparent, transparent);
  }
}
</style>