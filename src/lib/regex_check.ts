export interface TRegexCheckProps {
  username: string;
  regex?: string;
}
const regex_check = ({ regex, username }: TRegexCheckProps) => {
  if (regex == null) {
    return { is_regex_pass: true };
  }
  return { is_regex_pass: username.search(regex) >= 0 };
};

export default regex_check;
