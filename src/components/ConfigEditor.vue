<template>
  <form @submit.prevent="submit">
    <div class="inputs">
      <fieldset>
        <label>
          <span>Nom de la configuration</span>
          <input id="test" data-selector="name" type="text" placeholder="Serveur de mon app" :value="config.name" @input="handleUpdated" />
        </label>
        <label required>
          <span>Adresse IP du serveur</span>
          <input data-selector="serverIp" type="text" placeholder="123.456.78.9" :value="config.serverIp" @input="handleUpdated" />
        </label>
        <label>
          <span>Nom de l'utilisateur du serveur</span>
          <input data-selector="serverUsername" type="text" placeholder="john" :value="config.serverUsername" @input="handleUpdated" />
        </label>
        <label class="indented">
          <span>Mot de passe de l'utilisateur du serveur</span>
          <input
            data-selector="serverPassword"
            type="password"
            placeholder="password"
            :value="config.serverPassword"
            @input="handleUpdated"
          />
        </label>

        <div>ou</div>

        <label class="indented">
          <span>Chemin local de la clé ssh privée</span>
          <input
            data-selector="sshPrivateKeyPath"
            type="text"
            placeholder="/home/john/.ssh/id_rsa"
            :value="config.sshPrivateKeyPath"
            @input="handleUpdated"
          />
        </label>
      </fieldset>

      <fieldset>
        <label>
          <span>Port de la base de données</span>
          <input data-selector="dbPort" type="text" placeholder="3306" :value="config.dbPort" @input="handleUpdated" />
        </label>
        <label required>
          <span>Nom de la base de données</span>
          <input data-selector="dbName" type="text" placeholder="superbase" :value="config.dbName" @input="handleUpdated" />
        </label>
        <label>
          <span>Nom de l'administrateur de la base de données</span>
          <input data-selector="dbUsername" type="text" placeholder="db_admin" :value="config.dbUsername" @input="handleUpdated" />
        </label>
        <label>
          <span>Mot de passe de la base de données</span>
          <input data-selector="dbPassword" type="password" placeholder="password" :value="config.dbPassword" @input="handleUpdated" />
        </label>
      </fieldset>
    </div>

    <div class="config-actions">
      <button data-selector="saveButton" type="button" :disabled="isPristine" @click="handleSaved">Sauvegarder</button>
      <button data-selector="deleteButton" type="button" @click="handleDeleted">Supprimer</button>
    </div>

    <button type="submit" :disabled="!canSubmit" @click="submit">Connexion</button>
  </form>
</template>

<script>
import { Config } from '@/domain/Config.ts';

export default {
  props: {
    config: {
      type: Config,
      required: true,
    },

    isPristine: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    canSubmit() {
      const { serverIp, dbName } = this.config;

      return !!(serverIp && dbName);
    },
  },

  methods: {
    setupRequiredFields() {
      const requiredFields = document.querySelectorAll('label[required]');
      requiredFields.forEach(field => {
        field.querySelector('span').classList.add('required');
        field.querySelector('input').setAttribute('required', 'required');
      });
    },

    handleUpdated(event) {
      const property = event.target.getAttribute('data-selector');
      const { value } = event.target;
      this.$emit('updated', { [property]: value });
    },

    handleSaved() {
      this.$emit('saved');
    },

    handleDeleted() {
      this.$emit('deleted');
    },

    submit() {
      this.$emit('submitted');
    },
  },

  mounted() {
    this.setupRequiredFields();
  },
};
</script>

<style lang="scss" scoped>
.inputs {
  display: flex;
  justify-content: space-evenly;
}

label {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  align-items: flex-start;

  span {
    margin-bottom: 6px;

    &.required::after {
      content: '*';
      color: red;
    }
  }

  &.indented {
    margin-left: 18px;
  }
}

fieldset > div {
  margin-left: 18px;
  margin-bottom: 12px;
}
</style>
