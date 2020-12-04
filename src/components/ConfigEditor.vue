<template>
  <form @submit.prevent>
    <div class="config">
      <div class="inputs">
        <fieldset>
          <legend>Serveur</legend>

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
            <input
              data-selector="serverUsername"
              type="text"
              placeholder="john"
              :value="config.serverUsername"
              @input="handleUpdateConfig"
            />
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
              <button class="action" data-selector="sshKeyBrowseButton" type="button" @click.prevent="selectKeyPath">Parcourir</button>
            </div>
          </label>
        </fieldset>

        <fieldset>
          <legend>Base de données</legend>

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
        <button class="action harmless" data-selector="saveConfigButton" type="button" :disabled="isPristine" @click="handleSaveConfig">
          <span class="icon"><Save /></span>
          <span>Sauvegarder la configuration</span>
        </button>
        <button class="action warning" data-selector="deleteConfigButton" type="button" @click="handleDeleteConfig">
          Supprimer la configuration
        </button>
      </div>
    </div>

    <div class="database-action">
      <button class="action" data-selector="saveDbButton" type="button" :disabled="!isFormValid" @click="handleSaveDb">
        <span class="icon"><Download /></span>
        <span>Sauvegarder la base de données</span>
      </button>
      <div class="restore">
        <button class="action" data-selector="restoreDbButton" type="button" :disabled="!isFormValid" @click="handleRestoreDb">
          <span class="icon"><Upload /></span>
          <span>Restaurer la base de données</span>
        </button>
        <button class="action" data-selector="rollbackButton" type="button" v-if="showRollbackButton" @click="handleRollback">
          <span class="icon"><Rollback /></span>
          <span class="icon">Rollback</span>
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import { Config } from '@/domain/Config.ts';
import Eye from '@/icons/Eye.svg.vue';
import { browseForSshPrivateKey } from '@/utils/system';
import Download from '@/icons/download.svg.vue';
import Upload from '@/icons/upload.svg.vue';
import Save from '@/icons/save.svg.vue';
import Rollback from '@/icons/rollback.svg.vue';

export default {
  components: {
    Download,
    Eye,
    Rollback,
    Save,
    Upload,
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

    showRollbackButton: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isFormValid() {
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
      const keyPath = browseForSshPrivateKey();

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

    handleRollback() {
      this.$emit('rollback');
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
  margin-bottom: 12px;

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
        cursor: pointer;
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

  fieldset {
    legend {
      font-family: 'Kaushan Regular';
      font-size: 1.4rem;
      margin-bottom: 18px;
    }

    & > div {
      margin-left: 18px;
      margin-bottom: 12px;
    }
  }
}

.config {
  border: 1px solid lightgrey;
  border-radius: 5px;
  padding: 12px;
  margin-bottom: 18px;
  background-color: #fbfbfd;
}

.config-actions {
  display: flex;
  justify-content: flex-end;

  button {
    padding: 12px 15px 8px;
    display: flex;
    align-items: center;

    .icon {
      margin-right: 6px;

      svg {
        width: 18px;
        height: 18px;
      }
    }

    &:last-child {
      margin-left: 12px;
    }
  }
}

.database-action {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  button {
    padding: 15px 15px 5px;
    font-size: 1.1rem;
    display: flex;
    align-items: flex-start;

    .icon {
      margin-right: 6px;

      svg {
        width: 24px;
        height: 24px;
      }
    }
  }

  .restore {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;

    button {
      margin-bottom: 6px;
    }
  }
}
</style>
