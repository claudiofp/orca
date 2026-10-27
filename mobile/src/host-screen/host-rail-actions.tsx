import { Pressable, StyleSheet, View } from 'react-native'
import {
  List,
  Plus,
  Search,
  SquareTerminal,
  UserCircle,
  X,
  type LucideIcon
} from 'lucide-react-native'
import { colors, spacing } from '../theme/mobile-theme'
import type { HostScreenController } from './use-host-screen-controller'

type HostListAction = {
  id: 'accounts' | 'tasks' | 'search' | 'floating' | 'new'
  label: string
  icon: LucideIcon
  onPress: () => void
  disabled: boolean
}

// One list for the sidebar's toolbar row and the side rail, so both offer the same actions.
export function hostListActions(controller: HostScreenController): HostListAction[] {
  const { actions, connState, floatingWorkspaceEnabled, hostId, state } = controller
  const offline = connState !== 'connected'
  const hostPath = `/h/${encodeURIComponent(hostId)}`
  return [
    {
      id: 'accounts',
      label: 'Accounts',
      icon: UserCircle,
      onPress: () => actions.navigateFromHostList(`${hostPath}/accounts`),
      disabled: offline
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: List,
      onPress: () => actions.navigateFromHostList(`${hostPath}/tasks`),
      disabled: offline
    },
    ...(floatingWorkspaceEnabled
      ? [
          {
            id: 'floating' as const,
            label: 'Floating Workspace',
            icon: SquareTerminal,
            onPress: actions.openFloatingWorkspace,
            disabled: offline
          }
        ]
      : []),
    {
      id: 'new',
      label: 'New workspace',
      icon: Plus,
      onPress: actions.openNewWorktreeModal,
      disabled: offline
    },
    {
      id: 'search',
      label: state.showSearch ? 'Close search' : 'Search workspaces',
      icon: state.showSearch ? X : Search,
      onPress: () => state.setShowSearch((shown) => !shown),
      disabled: false
    }
  ]
}

const RAIL_ORDER: HostListAction['id'][] = ['accounts', 'tasks', 'search', 'floating']

// The rail reads top to bottom: navigation, then the workspace tools, then New as the one filled button.
export function HostRailActions({ controller }: { controller: HostScreenController }) {
  const all = hostListActions(controller)
  const listed = RAIL_ORDER.flatMap((id) => all.filter((action) => action.id === id))
  const create = all.find((action) => action.id === 'new')
  return (
    <View style={styles.rail}>
      {listed.map((action) => (
        <View key={action.id} style={styles.slot}>
          {action.id === 'floating' ? <View style={styles.divider} /> : null}
          <Pressable
            style={({ pressed }) => [
              styles.icon,
              pressed && styles.pressed,
              action.disabled && styles.disabled
            ]}
            onPress={action.onPress}
            disabled={action.disabled}
            accessibilityRole="button"
            accessibilityLabel={action.label}
          >
            <action.icon size={22} color={colors.textSecondary} />
          </Pressable>
        </View>
      ))}
      {create ? (
        <Pressable
          style={({ pressed }) => [
            styles.create,
            pressed && styles.createPressed,
            create.disabled && styles.disabled
          ]}
          onPress={create.onPress}
          disabled={create.disabled}
          accessibilityRole="button"
          accessibilityLabel={create.label}
        >
          <Plus size={24} color={colors.bgBase} strokeWidth={2.2} />
        </Pressable>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  rail: {
    alignItems: 'center',
    gap: spacing.sm
  },
  slot: {
    alignItems: 'center',
    gap: spacing.sm
  },
  icon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22
  },
  pressed: {
    backgroundColor: colors.bgRaised
  },
  disabled: {
    opacity: 0.4
  },
  divider: {
    width: 32,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderSubtle
  },
  create: {
    marginTop: spacing.xs,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceBright
  },
  createPressed: {
    opacity: 0.85
  }
})
