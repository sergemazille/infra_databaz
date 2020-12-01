<template>
  <form @submit.prevent>
    <div class="inputs">
      <fieldset>
        <label>
          <span>Nom de la configuration</span>
          <input data-selector="name" type="text" placeholder="Serveur de mon app" :value="config.name" @input="handleUpdateConfig" />
        </label>
        <label required>
          <span>Adresse IP du serveur</span>
          <input data-selector="serverIp" type="text" placeholder="123.456.78.9" :value="config.serverIp" @input="handleUpdateConfig" />
        </label>
        <label>
          <span>Port ssh du serveur</span>
          <input data-selector="serverSshPort" type="text" placeholder="22" :value="config.serverSshPort" @input="handleUpdateConfig" />
        </label>
        <label>
          <span>Nom de l'utilisateur du serveur</span>
          <input data-selector="serverUsername" type="text" placeholder="john" :value="config.serverUsername" @input="handleUpdateConfig" />
        </label>
        <label class="indented">
          <span>Mot de passe de l'utilisateur du serveur</span>
          <div class="input-group">
            <input
              data-selector="serverPassword"
              :type="isServerPasswordVisible ? 'text' : 'password'"
              placeholder="password"
              :value="config.serverPassword"
              @input="handleUpdateConfig"
            />
            <Eye
              class="icon"
              :class="{ isActive: !isServerPasswordVisible }"
              data-selector="serverPasswordVisibilityToggle"
              @click="isServerPasswordVisible = !isServerPasswordVisible"
            />
          </div>
        </label>

        <div>ou</div>

        <label class="indented">
          <span>Chemin local de la clé ssh privée</span>
          <div class="input-group">
            <input
              data-selector="sshPrivateKeyPath"
              type="text"
              placeholder="/home/john/.ssh/id_rsa"
              :value="config.sshPrivateKeyPath"
              @input="handleUpdateConfig"
            />
            <button data-selector="sshKeyBrowseButton" type="button" @click.prevent="selectKeyPath">Parcourir</button>
          </div>
        </label>
      </fieldset>

      <fieldset>
        <label>
          <span>Port de la base de données</span>
          <input data-selector="dbPort" type="text" placeholder="3306" :value="config.dbPort" @input="handleUpdateConfig" />
        </label>
        <label required>
          <span>Nom de la base de données</span>
          <input data-selector="dbName" type="text" placeholder="superbase" :value="config.dbName" @input="handleUpdateConfig" />
        </label>
        <label>
          <span>Nom de l'administrateur de la base de données</span>
          <input data-selector="dbUsername" type="text" placeholder="db_admin" :value="config.dbUsername" @input="handleUpdateConfig" />
        </label>
        <label>
          <span>Mot de passe de la base de données</span>
          <div class="input-group">
            <input
              data-selector="dbPassword"
              :type="isDbPasswordVisible ? 'text' : 'password'"
              placeholder="password"
              :value="config.dbPassword"
              @input="handleUpdateConfig"
            />
            <Eye
              class="icon"
              :class="{ isActive: !isDbPasswordVisible }"
              data-selector="dbPasswordVisibilityToggle"
              @click="isDbPasswordVisible = !isDbPasswordVisible"
            />
          </div>
        </label>
      </fieldset>
    </div>

    <div class="config-actions">
      <button data-selector="saveConfigButton" type="button" :disabled="isPristine" @click="handleSaveConfig">
        Sauvegarder la configuration
      </button>
      <button data-selector="deleteConfigButton" type="button" @click="handleDeleteConfig">
        Supprimer la configuration
      </button>
    </div>

    <button data-selector="saveDbButton" type="button" :disabled="!canSubmit" @click="handleSaveDb">Sauvegarder la base de données</button>
    <button data-selector="restoreDbButton" type="button" :disabled="!canSubmit" @click="handleRestoreDb">
      Restaurer la base de données
    </button>
  </form>
</template>

<script>
import { Config } from '@/domain/Config.ts';
import Eye from '@/icons/Eye.svg.vue';
import { browseForSshPrivateKeyPath } from '@/utils/system';

export default {
  components: {
    Eye,
  },

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

  data() {
    return {
      isServerPasswordVisible: false,
      isDbPasswordVisible: false,
    };
  },

  methods: {
    setupRequiredFields() {
      const requiredFields = document.querySelectorAll('label[required]');
      requiredFields.forEach(field => {
        field.querySelector('span').classList.add('required');
        field.querySelector('input').setAttribute('required', 'required');
      });
    },

    selectKeyPath() {
      const keyPath = browseForSshPrivateKeyPath();

      this.$emit('update', { sshPrivateKeyPath: keyPath });
    },

    handleUpdateConfig(event) {
      const property = event.target.getAttribute('data-selector');
      const { value } = event.target;
      this.$emit('update', { [property]: value });
    },

    handleSaveConfig() {
      this.$emit('save');
    },

    handleDeleteConfig() {
      this.$emit('delete');
    },

    handleSaveDb() {
      this.$emit('savedb');
    },

    handleRestoreDb() {
      this.$emit('restoredb');
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

  .input-group {
    display: flex;
    align-items: center;

    input {
      margin-right: 6px;
    }

    .icon {
      color: lightgrey;

      &.isActive {
        color: black;
      }
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
