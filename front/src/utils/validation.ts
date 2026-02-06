type ValidationRule = 'required' | 'minLength' | 'maxLength' | 'username' | 'password' | 'passwordsMatch'

export const validation = {
  isRequired(value: string): boolean {
    return !!(value && value.trim().length > 0)
  },

  minLength(value: string, length: number): boolean {
    return !!(value && value.length >= length)
  },

  maxLength(value: string, length: number): boolean {
    return !!(value && value.length <= length)
  },

  isUsername(value: string): boolean {
    if (!this.isRequired(value)) return false
    if (!this.minLength(value, 3)) return false
    if (!this.maxLength(value, 20)) return false
    return /^[a-zA-Z0-9_]+$/.test(value)
  },

  isPassword(value: string): boolean {
    if (!this.isRequired(value)) return false
    if (!this.minLength(value, 4)) return false
    return true
  },

  passwordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword
  },

  getErrorMessage(field: string, rule: ValidationRule, ...args: any[]): string {
    const messages: Record<ValidationRule, string> = {
      required: `${field}은(는) 필수 입력 항목입니다.`,
      minLength: `${field}은(는) 최소 ${args[0]}자 이상이어야 합니다.`,
      maxLength: `${field}은(는) 최대 ${args[0]}자 이하여야 합니다.`,
      username: '아이디는 3-20자의 영문, 숫자, 언더스코어만 사용 가능합니다.',
      password: '비밀번호는 최소 4자 이상이어야 합니다.',
      passwordsMatch: '비밀번호가 일치하지 않습니다.'
    }
    return messages[rule] || '유효하지 않은 값입니다.'
  }
}
