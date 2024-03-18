import {IAlphaTranslationCache} from "./ialpha-translation-cache";
import {IAlphaTranslationRow} from "./ialpha-translation-row";
import {IAlphaTranslationItem} from "./ialpha-translation-item";

export class AlphaTranslationCache implements IAlphaTranslationCache {
  private static readonly lsItemName = 'alphaTranslationsCache';

  private static readonly defaultCache: object = {
    "alpha.buttons.add": {
      "en": "Add",
      "fr": "Ajouter",
      "nl": "Toevoegen"
    },
    "alpha.buttons.cancel": {
      "en": "Cancel",
      "fr": "Annuler",
      "nl": "Annuleren"
    },
    "alpha.buttons.delete": {
      "en": "Delete",
      "fr": "Supprimer",
      "nl": "Deleten"
    },
    "alpha.buttons.edit": {
      "en": "Edit",
      "fr": "Éditer",
      "nl": "Bewerken"
    },
    "alpha.buttons.ok": {
      "en": "Ok",
      "fr": "Ok",
      "nl": "Ok"
    },
    "alpha.buttons.save": {
      "en": "Save",
      "fr": "Sauver",
      "nl": "Opslaan"
    },
    "alpha.buttons.submit": {
      "en": "Submit",
      "fr": "Soumettre",
      "nl": "Indienen"
    },
    "alpha.changePasswordForm.changePassword": {
      "en": "Change Password",
      "fr": "Changer le mot de passe",
      "nl": "Wachtwoord wijzigen"
    },
    "alpha.changePasswordForm.completed": {
      "en": "Your password has been updated",
      "fr": "Votre mot de passe a été modifié",
      "nl": "Uw wachtwoord is gewijzigd"
    },
    "alpha.changePasswordForm.currentPassword": {
      "en": "Current Password",
      "fr": "Mot de passe actuel",
      "nl": "Huidige wachtwoord"
    },
    "alpha.changePasswordForm.newPassword": {
      "en": "New Password",
      "fr": "Nouveau mot de passe",
      "nl": "Nieuw wachtwoord"
    },
    "alpha.changePasswordModal.title": {
      "en": "Change Password",
      "fr": "Changer le mot de passe",
      "nl": "Wachtwoord wijzigen"
    },
    "alpha.changeUsernameForm.duplicate": {
      "en": "This username is already registered",
      "fr": "Ce nom d'utilisateur est déjà enregistré",
      "nl": "Deze gebruikersnaam is al geregistreerd"
    },
    "alpha.changeUsernameForm.sameAsCurrent": {
      "en": "This username is already registered",
      "fr": "Ce nom d'utilisateur est déjà enregistré",
      "nl": "Deze gebruikersnaam is al geregistreerd"
    },
    "alpha.changeUsernameForm.username": {
      "en": "New username",
      "fr": "Nouveau nom d'utilisateur",
      "nl": "Nieuwe gebruikersnaam"
    },
    "alpha.changeUsernameForm.initialUsername": {
      "en": "Curent username",
      "fr": "Nom d'utilisateur actuel",
      "nl": "Huidig gebruikersnaam"
    },
    "alpha.changeUsernameForm.usernameChanged": {
      "en": "Your username has been changed",
      "fr": "Votre nom d'utilisateur a été modifié",
      "nl": "Uw gebruikersnaam is gewijzigd"
    },
    "alpha.changeUsernameModal.title": {
      "en": "Change my username",
      "fr": "Modidifer mon nom d'utilisateur",
      "nl": "Verander mijn gebruikersnaam"
    },
    "alpha.common.confirmPassword": {
      "en": "Confirmation",
      "fr": "Confirmation",
      "nl": "Bevestiging"
    },
    "alpha.common.email": {
      "en": "Email",
      "fr": "Email",
      "nl": "Email"
    },
    "alpha.common.failure": {
      "en": "Something wrong happened. Please retry.",
      "fr": "Une erreur s'est produite. Veuillez recommencer.",
      "nl": "Er is iets mis gegaan. Probeer het opnieuw."
    },
    "alpha.common.invalidCredentials": {
      "en": "Invalid login or password",
      "fr": "Login ou mot de passe incorrect",
      "nl": "Ongeldige login of wachtwoord"
    },
    "alpha.common.password": {
      "en": "Password",
      "fr": "Mot de passe",
      "nl": "Wachtwoord"
    },
    "alpha.common.passwordRules": {
      "en":
        "Your password must contain at least nine characters, one lower case, one upper case, one number and one special character",
      "fr":
        "Votre mot de passe doit au moins contenir neuf caractères, une minuscule, une majuscule, un chiffre et un caractère spécial",
      "nl":
        "Uw wachtwoord moet minimaal negen tekens, een kleine letter, een hoofdletter, een cijfer en een speciaal teken bevatten"
    },
    "alpha.common.username": {
      "en": "Login",
      "fr": "Login",
      "nl": "Login"
    },
    "alpha.confirmationModal.message": {
      "en": "Are you sure you want to do this?",
      "fr": "Êtes-vous certain de vouloir faire cela ?",
      "nl": "Wil je dit echt wel doen ?"
    },
    "alpha.confirmationModal.no": {
      "en": "No",
      "fr": "Non",
      "nl": "Nee"
    },
    "alpha.confirmationModal.title": {
      "en": "Confirmation",
      "fr": "Confirmation",
      "nl": "Bevestiging"
    },
    "alpha.confirmationModal.yes": {
      "en": "Yes",
      "fr": "Oui",
      "nl": "Ja"
    },
    "alpha.loginForm.connect": {
      "en": "Connect",
      "fr": "Se connecter",
      "nl": "Inloggen"
    },
    "alpha.loginForm.resetPassword": {
      "en": "Get a new password",
      "fr": "Reset du mot de passe",
      "nl": "Vraag een nieuw wachtwoord aan"
    },
    "alpha.loginModal.title": {
      "en": "Connect",
      "fr": "Se connecter",
      "nl": "Inloggen"
    },
    "alpha.resetPasswordForm.completed": {
      "en": "Your password has been reset",
      "fr": "Votre mot de passe a été réinitialisé",
      "nl": "Uw wachtwoord is opnieuw ingesteld"
    },
    "alpha.resetPasswordForm.invalidPasswordOrToken": {
      "en": "The email invitation for resetting your password has expired",
      "fr": "L'email de réinitialisation de votre mot de passe a éxpiré",
      "nl": "De email voor het opnieuw instellen van uw wachtwoord is verlopen"
    },
    "alpha.resetPasswordForm.noSuchUsername": {
      "en": "The provided username is incorrect",
      "fr": "Le nom d'utilisateur n'est pas correct",
      "nl": "De opgegeven gebruikersnaam is onjuist"
    },
    "alpha.resetPasswordModal.title": {
      "en": "Reset your password",
      "fr": "Réinitialiser votre mot de passe",
      "nl": "Uw wachtwoord opnieuw instellen"
    },
    "alpha.sendResetPasswordTokenForm.emailSent": {
      "en":
        "If provided email is associated to your username, you'll get soon an email with a link for resetting your password. Please make sure this email will not drop into your spams.",
      "fr":
        "Si l'email fournit est bien associé à votre login, vous recevrez bientôt un email à cette adresse avec un lien qui vous permettra d'encoder un nouveau mot de passe. Vérifiez bien que cet email ne se retrouve pas dans vos spams",
      "nl":
        "Als het opgegeven emailadres is gekoppeld aan uw gebruikersnaam, ontvangt u binnenkort een email met een link om uw wachtwoord opnieuw in te stellen. Zorg ervoor dat deze email niet in uw spams terecht komt."
    },
    "alpha.sendResetPasswordTokenModal.title": {
      "en": "Get a new password",
      "fr": "Reset du mot de passe",
      "nl": "Vraag een nieuw wachtwoord aan"
    }
  };

  translations: IAlphaTranslationRow[];
  // UTC time of last update in Milliseconds
  lastUpdateTs: number;

  get lastUpdateDate(): Date {
    return new Date(this.lastUpdateTs);
  }

  private constructor(
    lastUpdateDate: Date,
    translations: IAlphaTranslationRow[]) {
    this.lastUpdateTs = lastUpdateDate.getTime();
    this.translations = translations;
  }

  static get default(): IAlphaTranslationCache {
    // transform the static translations into
    // a dictionary
    const transDic = this.convertToRows(
      AlphaTranslationCache.defaultCache);
    return new AlphaTranslationCache(new Date(), transDic);
  }

  private static convertToRows(tc: any): IAlphaTranslationRow[] {
    const tcEntries = Object.entries(tc);
    const transRows: IAlphaTranslationRow[] = [];
    tcEntries.forEach(
      (row: [string, any]) => {
        const rowKey = row[0];
        const rowValues = row[1];
        const values = Object.entries(rowValues);

        const rowItems: IAlphaTranslationItem[] = [];
        values.forEach(
          (value: [string, any]) => {
            const rowItem: IAlphaTranslationItem = {
              languageCode: value[0],
              translation: value[1]
            }
            rowItems.push(rowItem);
          }
        )
        const transRow: IAlphaTranslationRow = {
          key: rowKey,
          translationItems: rowItems
        };
        transRows.push(transRow);
      }
    );
    return transRows;
  }

  static factorFromDso(dso: any): IAlphaTranslationCache {
    const dt = new Date(dso.lastUpdateDate);
    const transDic =
      this.convertToRows(dso.translations);
    return new AlphaTranslationCache(dt, transDic);
  }

  static retrieve(): IAlphaTranslationCache {
    const json = localStorage.getItem(this.lsItemName);
    if (json) {
      const tc = JSON.parse(json);
      const dt = new Date(tc.lastUpdateTs);
      const translations = tc.translations as IAlphaTranslationRow[];
      return new AlphaTranslationCache(dt, translations);
    } else {
      return new AlphaTranslationCache(
        new Date(1970, 0, 1,
          0, 0, 0, 0),
        []);
    }
  }

  store(): void {
    const json = JSON.stringify(this);
    localStorage.setItem(
      AlphaTranslationCache.lsItemName,
      json);
  }
}
