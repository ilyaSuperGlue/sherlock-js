export interface TRegexCheckProps {
  username: string;
  regexCheck?: string;
}
const regex_check = ({
  regexCheck,
  username,
}: TRegexCheckProps): { is_regex_pass: boolean } => {
  if (regexCheck == null) {
    return { is_regex_pass: true };
  }
  return { is_regex_pass: username.search(regexCheck) >= 0 };
};

export default regex_check;
